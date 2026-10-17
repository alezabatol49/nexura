import { useState, useEffect, useCallback } from "react";
import {
  Lock,
  Plus,
  Pencil,
  Trash2,
  X,
  Settings as SettingsIcon,
  Package,
  LogOut,
  Upload,
  Github,
  Check,
  AlertCircle,
  Search,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import {
  Product,
  ADMIN_CATEGORIES,
  ALL_SIZES,
  ALL_GENDERS,
  ADMIN_PIN,
  formatPrice,
} from "../lib/types";
import {
  GitHubSettings,
  loadGitHubSettings,
  saveGitHubSettings,
  hasGitHubToken,
  pushToGitHub,
} from "../lib/github";
import { navigate } from "../lib/useRoute";

type Tab = "products" | "settings";

type FormData = {
  name: string;
  category: string;
  gender: string;
  price_pkr: string;
  compare_price_pkr: string;
  description: string;
  image_url: string;
  sizes: string[];
  colors: string;
  badge: string;
  in_stock: boolean;
};

const EMPTY_FORM: FormData = {
  name: "",
  category: "puffer-jackets",
  gender: "unisex",
  price_pkr: "",
  compare_price_pkr: "",
  description: "",
  image_url: "",
  sizes: ["S", "M", "L", "XL"],
  colors: "Obsidian,Frost",
  badge: "",
  in_stock: true,
};

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);

  const handlePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setAuthed(true);
      setPinError(false);
      sessionStorage.setItem("nexura-admin", "1");
    } else {
      setPinError(true);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("nexura-admin") === "1") setAuthed(true);
  }, []);

  if (!authed) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center px-5">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 border border-gold/30 mb-6">
              <Lock size={24} className="text-gold" />
            </div>
            <h1 className="font-display text-2xl tracking-[0.2em] text-frost font-bold mb-2 pl-[0.2em]">
              NEXURA
            </h1>
            <p className="text-[10px] tracking-[0.3em] uppercase text-frost/40">Admin Panel</p>
          </div>
          <form onSubmit={handlePin} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setPinError(false);
              }}
              placeholder="Enter PIN"
              maxLength={8}
              autoFocus
              className="w-full bg-obsidian-50 border border-frost/15 px-5 py-4 text-center text-lg tracking-[0.4em] text-frost placeholder:text-frost/25 focus:outline-none focus:border-gold/50 transition-colors"
            />
            {pinError && (
              <p className="flex items-center justify-center gap-2 text-xs text-red-400">
                <AlertCircle size={14} /> Incorrect PIN. Try again.
              </p>
            )}
            <button type="submit" className="btn-primary w-full !py-4">
              Unlock
            </button>
          </form>
          <button
            onClick={() => navigate("/")}
            className="mt-6 w-full text-center text-[11px] tracking-[0.2em] uppercase text-frost/40 hover:text-frost transition-colors"
          >
            ← Back to Store
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={() => {
    sessionStorage.removeItem("nexura-admin");
    setAuthed(false);
    navigate("/");
  }} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [github, setGithub] = useState<GitHubSettings>(loadGitHubSettings());

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      showToast("Failed to load products", "err");
    } else {
      setProducts((data ?? []) as Product[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSave = async (form: FormData, id: string | null) => {
    const payload = {
      name: form.name.trim(),
      category: form.category,
      gender: form.gender,
      price_pkr: parseFloat(form.price_pkr) || 0,
      compare_price_pkr: form.compare_price_pkr ? parseFloat(form.compare_price_pkr) : null,
      description: form.description.trim(),
      image_url: form.image_url.trim(),
      sizes: form.sizes,
      colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
      badge: form.badge.trim() || null,
      in_stock: form.in_stock,
    };

    if (!payload.name || !payload.image_url || payload.price_pkr <= 0) {
      showToast("Name, image URL, and price are required", "err");
      return;
    }

    if (id) {
      const { error } = await supabase.from("products").update(payload).eq("id", id);
      if (error) {
        showToast("Update failed: " + error.message, "err");
        return;
      }
      showToast("Product updated");
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) {
        showToast("Add failed: " + error.message, "err");
        return;
      }
      showToast("Product added");
    }

    // GitHub sync
    if (hasGitHubToken(github)) {
      const { data: all } = await supabase.from("products").select("*").order("created_at", { ascending: true });
      const result = await pushToGitHub(github, JSON.stringify(all ?? [], null, 2), `Update products: ${payload.name}`);
      if (result.success) showToast("Synced to GitHub");
      else showToast("GitHub sync failed: " + result.error, "err");
    }

    setShowForm(false);
    setEditing(null);
    fetchProducts();
  };

  const handleDelete = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) {
      showToast("Delete failed: " + error.message, "err");
      return;
    }
    showToast("Product deleted");
    if (hasGitHubToken(github)) {
      const { data: all } = await supabase.from("products").select("*").order("created_at", { ascending: true });
      await pushToGitHub(github, JSON.stringify(all ?? [], null, 2), `Delete product: ${p.name}`);
    }
    fetchProducts();
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-obsidian text-frost">
      {/* Admin header */}
      <header className="sticky top-0 z-30 bg-obsidian-100/95 backdrop-blur-md border-b border-frost/10">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg tracking-[0.2em] text-frost font-bold pl-[0.2em]">NEXURA</span>
            <span className="text-[9px] tracking-[0.25em] uppercase text-gold border border-gold/30 px-2 py-0.5">Admin</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-frost/60 hover:text-frost transition-colors"
            >
              <ArrowLeft size={14} /> <span className="hidden sm:inline">Store</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-frost/60 hover:text-red-400 transition-colors"
            >
              <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 sm:px-6">
          <TabBtn active={tab === "products"} onClick={() => setTab("products")} icon={Package} label="Products" />
          <TabBtn active={tab === "settings"} onClick={() => setTab("settings")} icon={SettingsIcon} label="Settings" />
        </div>
      </header>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 text-xs tracking-wider animate-fade-in ${
          toast.type === "ok" ? "bg-[#1f7a4d] text-white" : "bg-red-900 text-white"
        }`}>
          {toast.msg}
        </div>
      )}

      <main className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
        {tab === "products" && (
          <ProductsTab
            products={filtered}
            loading={loading}
            search={search}
            setSearch={setSearch}
            onAdd={() => { setEditing(null); setShowForm(true); }}
            onEdit={(p) => { setEditing(p); setShowForm(true); }}
            onDelete={handleDelete}
          />
        )}
        {tab === "settings" && (
          <SettingsTab github={github} onSave={(g) => { saveGitHubSettings(g); setGithub(g); showToast("Settings saved"); }} />
        )}
      </main>

      {showForm && (
        <ProductForm
          product={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function TabBtn({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: typeof Package; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 text-[11px] tracking-[0.2em] uppercase border-b-2 transition-colors ${
        active ? "border-gold text-frost" : "border-transparent text-frost/40 hover:text-frost/70"
      }`}
    >
      <Icon size={14} /> {label}
    </button>
  );
}

function ProductsTab({
  products, loading, search, setSearch, onAdd, onEdit, onDelete,
}: {
  products: Product[];
  loading: boolean;
  search: string;
  setSearch: (s: string) => void;
  onAdd: () => void;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}) {
  return (
    <div>
      {/* Search + Add */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-frost/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-obsidian-50 border border-frost/15 pl-11 pr-4 py-3 text-sm text-frost placeholder:text-frost/25 focus:outline-none focus:border-gold/40 transition-colors"
          />
        </div>
        <button onClick={onAdd} className="btn-primary !px-5 !py-3 shrink-0">
          <Plus size={16} /> <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      {/* Count */}
      <p className="text-[10px] tracking-[0.2em] uppercase text-frost/40 mb-4">
        {loading ? "Loading..." : `${products.length} product${products.length !== 1 ? "s" : ""}`}
      </p>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-obsidian-50 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 border border-frost/10">
          <Package size={32} className="text-frost/20 mx-auto mb-4" />
          <p className="text-sm text-frost/40">No products found.</p>
          <button onClick={onAdd} className="mt-4 btn-ghost !py-2.5">Add your first product</button>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <ProductRow key={p.id} product={p} onEdit={() => onEdit(p)} onDelete={() => onDelete(p)} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductRow({ product, onEdit, onDelete }: { product: Product; onEdit: () => void; onDelete: () => void }) {
  const catLabel = ADMIN_CATEGORIES.find((c) => c.slug === product.category)?.label ?? product.category;
  return (
    <div className="flex items-center gap-3 sm:gap-4 bg-obsidian-50 border border-frost/8 p-3 hover:border-frost/15 transition-colors">
      {/* Thumb */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-obsidian overflow-hidden">
        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm text-frost font-medium truncate">{product.name}</h3>
        <p className="text-[10px] tracking-wider uppercase text-frost/40 mt-0.5">{catLabel}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs text-gold font-medium">{formatPrice(product.price_pkr, "PKR")}</span>
          {product.compare_price_pkr != null && product.compare_price_pkr > product.price_pkr && (
            <span className="text-[10px] text-frost/30 line-through">{formatPrice(product.compare_price_pkr, "PKR")}</span>
          )}
          <span className={`text-[9px] tracking-widest uppercase px-2 py-0.5 ${
            product.in_stock ? "text-[#1f7a4d] border border-[#1f7a4d]/30" : "text-red-400 border border-red-400/30"
          }`}>
            {product.in_stock ? "In Stock" : "Sold Out"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 shrink-0">
        <button
          onClick={onEdit}
          className="flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 border border-frost/15 text-frost/60 hover:border-gold/40 hover:text-gold transition-colors"
          aria-label="Edit"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={onDelete}
          className="flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 border border-frost/15 text-frost/60 hover:border-red-400/40 hover:text-red-400 transition-colors"
          aria-label="Delete"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

function ProductForm({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (form: FormData, id: string | null) => void;
}) {
  const [form, setForm] = useState<FormData>(() => {
    if (product) {
      return {
        name: product.name,
        category: product.category,
        gender: product.gender,
        price_pkr: String(product.price_pkr),
        compare_price_pkr: product.compare_price_pkr != null ? String(product.compare_price_pkr) : "",
        description: product.description,
        image_url: product.image_url,
        sizes: product.sizes,
        colors: product.colors.join(","),
        badge: product.badge ?? "",
        in_stock: product.in_stock,
      };
    }
    return EMPTY_FORM;
  });

  const [uploading, setUploading] = useState(false);

  const handleFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB for Base64 storage");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, image_url: reader.result as string }));
      setUploading(false);
    };
    reader.onerror = () => setUploading(false);
    reader.readAsDataURL(file);
  };

  const toggleSize = (s: string) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s],
    }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form, product?.id ?? null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-obsidian/85 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-obsidian-100 border border-frost/10 rounded-t-2xl sm:rounded-none">
        {/* Header */}
        <div className="sticky top-0 bg-obsidian-100 border-b border-frost/10 px-5 py-4 flex items-center justify-between z-10">
          <h2 className="font-display text-lg text-frost font-bold">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="text-frost/50 hover:text-frost transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-5">
          {/* Image */}
          <div>
            <Label>Product Image</Label>
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 shrink-0 bg-obsidian border border-frost/10 overflow-hidden">
                {form.image_url ? (
                  <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Upload size={18} className="text-frost/20" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="url"
                  value={form.image_url.startsWith("data:") ? "" : form.image_url}
                  onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                  placeholder="Paste image URL..."
                  className="w-full bg-obsidian border border-frost/15 px-3 py-2.5 text-sm text-frost placeholder:text-frost/25 focus:outline-none focus:border-gold/40 transition-colors"
                />
                <label className="flex items-center justify-center gap-2 w-full border border-dashed border-frost/20 px-3 py-2.5 text-[11px] tracking-wider uppercase text-frost/50 hover:border-gold/40 hover:text-gold transition-colors cursor-pointer">
                  <Upload size={13} />
                  {uploading ? "Converting..." : "Upload from device"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <Label>Product Name</Label>
            <Input value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="NEXURA Obsidian Puffer" />
          </div>

          {/* Category + Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <Select value={form.category} onChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                {ADMIN_CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.label}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Gender</Label>
              <Select value={form.gender} onChange={(v) => setForm((f) => ({ ...f, gender: v }))}>
                {ALL_GENDERS.map((g) => (
                  <option key={g} value={g}>{g === "men" ? "Men" : g === "women" ? "Women" : "Unisex"}</option>
                ))}
              </Select>
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Price (PKR)</Label>
              <Input type="number" value={form.price_pkr} onChange={(v) => setForm((f) => ({ ...f, price_pkr: v }))} placeholder="4999" />
            </div>
            <div>
              <Label>Compare-at (PKR)</Label>
              <Input type="number" value={form.compare_price_pkr} onChange={(v) => setForm((f) => ({ ...f, compare_price_pkr: v }))} placeholder="7999" />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <Label>Sizes Available</Label>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  className={`px-4 py-2.5 text-xs tracking-wider border transition-colors ${
                    form.sizes.includes(s)
                      ? "border-frost bg-frost text-obsidian"
                      : "border-frost/20 text-frost/50 hover:border-frost/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <Label>Colors (comma-separated)</Label>
            <Input value={form.colors} onChange={(v) => setForm((f) => ({ ...f, colors: v }))} placeholder="Obsidian, Frost, Charcoal" />
          </div>

          {/* Badge */}
          <div>
            <Label>Badge (optional)</Label>
            <Input value={form.badge} onChange={(v) => setForm((f) => ({ ...f, badge: v }))} placeholder="New, Bestseller, Limited" />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              placeholder="Editorial product description..."
              className="w-full bg-obsidian border border-frost/15 px-4 py-3 text-sm text-frost placeholder:text-frost/25 focus:outline-none focus:border-gold/40 transition-colors resize-none"
            />
          </div>

          {/* In stock toggle */}
          <div className="flex items-center justify-between py-2">
            <Label>In Stock</Label>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, in_stock: !f.in_stock }))}
              className={`relative w-14 h-7 rounded-full transition-colors ${form.in_stock ? "bg-[#1f7a4d]" : "bg-frost/15"}`}
            >
              <span className={`absolute top-1 w-5 h-5 bg-frost rounded-full transition-all ${form.in_stock ? "left-8" : "left-1"}`} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 !py-4">
              <Check size={16} /> {product ? "Save Changes" : "Add Product"}
            </button>
            <button type="button" onClick={onClose} className="btn-ghost !py-4 !px-6">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SettingsTab({ github, onSave }: { github: GitHubSettings; onSave: (g: GitHubSettings) => void }) {
  const [form, setForm] = useState<GitHubSettings>(github);
  const [showToken, setShowToken] = useState(false);

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Github size={18} className="text-gold" />
          <h2 className="font-display text-xl text-frost font-bold">GitHub Sync</h2>
        </div>
        <p className="text-sm text-frost/50 leading-relaxed">
          Connect your GitHub repo to automatically sync product data on every save or delete. If no token is set, products are saved to the database only.
        </p>
      </div>

      <div className="space-y-4 bg-obsidian-50 border border-frost/8 p-5">
        {/* Token */}
        <div>
          <Label>Personal Access Token (PAT)</Label>
          <div className="relative">
            <input
              type={showToken ? "text" : "password"}
              value={form.token}
              onChange={(e) => setForm((f) => ({ ...f, token: e.target.value }))}
              placeholder="ghp_..."
              className="w-full bg-obsidian border border-frost/15 px-4 py-3 pr-20 text-sm text-frost placeholder:text-frost/25 focus:outline-none focus:border-gold/40 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowToken((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] tracking-wider uppercase text-frost/40 hover:text-frost transition-colors"
            >
              {showToken ? "Hide" : "Show"}
            </button>
          </div>
          <p className="text-[10px] text-frost/30 mt-1.5">Needs `repo` scope. Stored locally in your browser only.</p>
        </div>

        {/* Owner */}
        <div>
          <Label>Repo Owner</Label>
          <Input value={form.owner} onChange={(v) => setForm((f) => ({ ...f, owner: v }))} placeholder="alezabatol49" />
        </div>

        {/* Repo */}
        <div>
          <Label>Repo Name</Label>
          <Input value={form.repo} onChange={(v) => setForm((f) => ({ ...f, repo: v }))} placeholder="nexura" />
        </div>

        {/* Branch */}
        <div>
          <Label>Branch</Label>
          <Input value={form.branch} onChange={(v) => setForm((f) => ({ ...f, branch: v }))} placeholder="main" />
        </div>

        {/* File path */}
        <div>
          <Label>File Path</Label>
          <Input value={form.path} onChange={(v) => setForm((f) => ({ ...f, path: v }))} placeholder="src/data/products.json" />
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 pt-2">
          <span className={`w-2 h-2 rounded-full ${hasGitHubToken(form) ? "bg-[#1f7a4d]" : "bg-frost/20"}`} />
          <span className="text-[11px] tracking-wider text-frost/50">
            {hasGitHubToken(form) ? "Sync active — products will push to GitHub on save/delete" : "No token — saving to database only"}
          </span>
        </div>

        <button onClick={() => onSave(form)} className="btn-primary w-full !py-4 mt-2">
          <Check size={16} /> Save Settings
        </button>
      </div>
    </div>
  );
}

/* — Shared form primitives — */

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-[10px] tracking-[0.25em] uppercase text-frost/50 mb-2">{children}</label>;
}

function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-obsidian border border-frost/15 px-4 py-3 text-sm text-frost placeholder:text-frost/25 focus:outline-none focus:border-gold/40 transition-colors"
    />
  );
}

function Select({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-obsidian border border-frost/15 px-4 py-3 text-sm text-frost focus:outline-none focus:border-gold/40 transition-colors"
    >
      {children}
    </select>
  );
}
