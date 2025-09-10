import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Plus, Search, Edit, Trash2, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  price: number;
  cost: number;
  category: string;
  stock: number;
  minStock: number;
  description: string;
  sku: string;
}

const mockProducts: Product[] = [
  { 
    id: 1, 
    name: "Premium Coffee", 
    price: 4.99, 
    cost: 2.50,
    category: "Beverages", 
    stock: 50, 
    minStock: 20,
    description: "High-quality arabica coffee blend",
    sku: "BEV001"
  },
  { 
    id: 2, 
    name: "Chocolate Croissant", 
    price: 3.49, 
    cost: 1.20,
    category: "Pastries", 
    stock: 15, 
    minStock: 20,
    description: "Fresh baked chocolate pastry",
    sku: "PAS001"
  },
  { 
    id: 3, 
    name: "Energy Drink", 
    price: 2.99, 
    cost: 1.50,
    category: "Beverages", 
    stock: 100, 
    minStock: 30,
    description: "High caffeine energy boost",
    sku: "BEV002"
  },
  { 
    id: 4, 
    name: "Protein Bar", 
    price: 3.99, 
    cost: 2.00,
    category: "Snacks", 
    stock: 75, 
    minStock: 25,
    description: "High protein nutrition bar",
    sku: "SNK001"
  },
];

const InventoryManagement = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProduct,
      id: Math.max(...products.map(p => p.id)) + 1
    };
    setProducts(prev => [...prev, product]);
    setIsAddDialogOpen(false);
    toast({
      title: "Product Added",
      description: `${product.name} has been added to inventory`,
    });
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setEditingProduct(null);
    toast({
      title: "Product Updated",
      description: `${updatedProduct.name} has been updated`,
    });
  };

  const handleDeleteProduct = (id: number) => {
    const product = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Product Deleted",
      description: `${product?.name} has been removed from inventory`,
      variant: "destructive",
    });
  };

  const calculateProfit = (product: Product) => {
    return ((product.price - product.cost) / product.price * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-glass/80 backdrop-blur-xl border-b border-glass-border sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-warning rounded-xl flex items-center justify-center">
                <Package className="h-5 w-5 text-warning-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Inventory Management</h1>
                <p className="text-sm text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
              Admin Access
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-glass/50 backdrop-blur-sm border-glass-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold text-primary">{products.length}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-glass/50 backdrop-blur-sm border-glass-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock Items</p>
                  <p className="text-2xl font-bold text-warning">{lowStockProducts.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-glass/50 backdrop-blur-sm border-glass-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Stock Value</p>
                  <p className="text-2xl font-bold text-success">
                    ${products.reduce((total, p) => total + (p.stock * p.cost), 0).toFixed(0)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-glass/50 backdrop-blur-sm border-glass-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold text-accent">{categories.length - 1}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="bg-glass/50 backdrop-blur-sm border-glass-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Product Management
              </CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-success hover:shadow-success-glow">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <ProductDialog
                  onSave={handleAddProduct}
                  onClose={() => setIsAddDialogOpen(false)}
                />
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Search by product name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-secondary/50 border-input-border"
              />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-secondary/50 border-input-border">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className={`bg-glass/50 backdrop-blur-sm border-glass-border hover:bg-glass/70 transition-all duration-300 ${
                product.stock <= product.minStock ? 'border-warning/50 shadow-warning-glow' : 'hover:shadow-card'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription className="text-sm">
                      SKU: {product.sku} • {product.category}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingProduct(product)}
                      className="h-8 w-8 p-0 hover:bg-primary/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="h-8 w-8 p-0 hover:bg-danger/10 hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Price</p>
                    <p className="font-semibold text-primary">${product.price}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cost</p>
                    <p className="font-semibold">${product.cost}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Stock</p>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{product.stock}</p>
                      {product.stock <= product.minStock && (
                        <AlertTriangle className="h-4 w-4 text-warning" />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Profit Margin</p>
                    <p className="font-semibold text-success">{calculateProfit(product)}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge 
                    variant={product.stock <= product.minStock ? "destructive" : "secondary"}
                    className={product.stock <= product.minStock ? "bg-warning/10 text-warning border-warning/20" : ""}
                  >
                    {product.stock <= product.minStock ? "Low Stock" : "In Stock"}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Min: {product.minStock}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Product Dialog */}
        {editingProduct && (
          <ProductDialog
            product={editingProduct}
            onSave={handleUpdateProduct}
            onClose={() => setEditingProduct(null)}
            isOpen={true}
          />
        )}
      </div>
    </div>
  );
};

// Product Dialog Component
interface ProductDialogProps {
  product?: Product;
  onSave: (product: Product | Omit<Product, 'id'>) => void;
  onClose: () => void;
  isOpen?: boolean;
}

const ProductDialog = ({ product, onSave, onClose, isOpen }: ProductDialogProps) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price.toString() || "",
    cost: product?.cost.toString() || "",
    category: product?.category || "",
    stock: product?.stock.toString() || "",
    minStock: product?.minStock.toString() || "",
    description: product?.description || "",
    sku: product?.sku || "",
  });

  const handleSave = () => {
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      category: formData.category,
      stock: parseInt(formData.stock),
      minStock: parseInt(formData.minStock),
      description: formData.description,
      sku: formData.sku,
    };

    if (product) {
      onSave({ ...productData, id: product.id });
    } else {
      onSave(productData);
    }
  };

  return (
    <DialogContent className="bg-glass/95 backdrop-blur-xl border-glass-border max-w-md">
      <DialogHeader>
        <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        <DialogDescription>
          {product ? "Update product information" : "Add a new product to your inventory"}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-secondary/50 border-input-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
              className="bg-secondary/50 border-input-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="bg-secondary/50 border-input-border"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="bg-secondary/50 border-input-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost">Cost ($)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
              className="bg-secondary/50 border-input-border"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="bg-secondary/50 border-input-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
              className="bg-secondary/50 border-input-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minStock">Min Stock</Label>
            <Input
              id="minStock"
              type="number"
              value={formData.minStock}
              onChange={(e) => setFormData(prev => ({ ...prev, minStock: e.target.value }))}
              className="bg-secondary/50 border-input-border"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-gradient-primary hover:shadow-glow">
            {product ? "Update" : "Add"} Product
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default InventoryManagement;