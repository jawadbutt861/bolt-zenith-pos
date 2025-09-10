import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock product data
const mockProducts = [
  { id: 1, name: "Premium Coffee", price: 4.99, category: "Beverages", stock: 50, image: "☕" },
  { id: 2, name: "Chocolate Croissant", price: 3.49, category: "Pastries", stock: 25, image: "🥐" },
  { id: 3, name: "Energy Drink", price: 2.99, category: "Beverages", stock: 100, image: "🥤" },
  { id: 4, name: "Protein Bar", price: 3.99, category: "Snacks", stock: 75, image: "🍫" },
  { id: 5, name: "Sandwich", price: 8.99, category: "Food", stock: 30, image: "🥪" },
  { id: 6, name: "Smoothie", price: 5.99, category: "Beverages", stock: 40, image: "🥤" },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const CashierDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: typeof mockProducts[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, change: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to the cart before checkout",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Payment Successful! 🎉",
      description: `Transaction completed for $${calculateTotal().toFixed(2)}`,
    });
    
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-glass/80 backdrop-blur-xl border-b border-glass-border sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">NeonPOS Cashier</h1>
                <p className="text-sm text-muted-foreground">Point of Sale Terminal</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              Online
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <Card className="bg-glass/50 backdrop-blur-sm border-glass-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Product Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search products by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-secondary/50 border-input-border"
                />
              </CardContent>
            </Card>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="bg-glass/50 backdrop-blur-sm border-glass-border hover:bg-glass/70 transition-all duration-300 hover:shadow-card cursor-pointer group"
                  onClick={() => addToCart(product)}
                >
                  <CardContent className="p-4">
                    <div className="text-center mb-3">
                      <div className="text-4xl mb-2">{product.image}</div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">${product.price}</span>
                      <Badge 
                        variant={product.stock < 20 ? "destructive" : "secondary"}
                        className={product.stock < 20 ? "bg-warning/10 text-warning border-warning/20" : ""}
                      >
                        {product.stock} left
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="space-y-6">
            <Card className="bg-glass/80 backdrop-blur-xl border-glass-border shadow-card sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-neon-green" />
                  Shopping Cart
                </CardTitle>
                <CardDescription>
                  {cart.length} item{cart.length !== 1 ? 's' : ''} in cart
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Cart is empty</p>
                    <p className="text-sm">Add products to get started</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <p className="text-primary font-semibold">${item.price}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeFromCart(item.id)}
                              className="h-8 w-8 p-0 ml-2"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total:</span>
                        <span className="text-primary">${calculateTotal().toFixed(2)}</span>
                      </div>
                      
                      <Button
                        onClick={handleCheckout}
                        className="w-full bg-gradient-success hover:shadow-success-glow transition-all duration-300 font-semibold"
                        size="lg"
                      >
                        <CreditCard className="h-5 w-5 mr-2" />
                        Complete Payment
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full border-primary/20 hover:bg-primary/5"
                        size="lg"
                      >
                        <Receipt className="h-5 w-5 mr-2" />
                        Print Receipt
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashierDashboard;