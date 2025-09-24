import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GameHeader from "@/components/GameHeader";
import BottomTabBar from "@/components/BottomTabBar";
import { 
  Building2, 
  ShoppingBag, 
  Dumbbell, 
  Star, 
  Gamepad2, 
  Home, 
  CreditCard, 
  Plane, 
  Share2, 
  Settings,
  ArrowLeft
} from "lucide-react";

interface DashboardItem {
  id: string;
  title: string;
  icon: any;
  description: string;
}

interface DashProps {
  onNavigate?: (path: string) => void;
}

const dashboardItems: DashboardItem[] = [
  { id: "business", title: "Business", icon: Building2, description: "Manage your business ventures and investments" },
  { id: "shop", title: "Shop", icon: ShoppingBag, description: "Purchase gear, clothing, and equipment" },
  { id: "gym", title: "Gym", icon: Dumbbell, description: "Train and improve your physical attributes" },
  { id: "talents", title: "Talents", icon: Star, description: "Develop special skills and abilities" },
  { id: "hobbies", title: "Hobbies", icon: Gamepad2, description: "Pursue interests outside of basketball" },
  { id: "properties", title: "Properties", icon: Home, description: "Buy and manage real estate investments" },
  { id: "subscriptions", title: "Subscriptions", icon: CreditCard, description: "Manage your monthly subscriptions and services" },
  { id: "vacations", title: "Vacations", icon: Plane, description: "Plan trips and getaways to boost mood" },
  { id: "social_media", title: "Social Media", icon: Share2, description: "Build your online presence and followers" },
  { id: "preferences", title: "Preferences", icon: Settings, description: "Customize your lifestyle and priorities" },
];

export default function Dash({ onNavigate }: DashProps) {
  const [selectedItem, setSelectedItem] = useState<DashboardItem | null>(null);

  const handleItemClick = (item: DashboardItem) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <GameHeader />
      
      <main className="px-4 pt-4 pb-20 max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onNavigate?.('/home')}
              data-testid="button-back-to-home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">Life Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Manage every aspect of your basketball career and life
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {dashboardItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card 
                key={item.id}
                className="cursor-pointer hover-elevate transition-all duration-200"
                onClick={() => handleItemClick(item)}
                data-testid={`dash-card-${item.id}`}
              >
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-sm">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      <BottomTabBar />

      {/* Coming Soon Modal */}
      <Dialog open={!!selectedItem} onOpenChange={closeModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedItem && <selectedItem.icon className="w-5 h-5" />}
              {selectedItem?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedItem?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Coming Soon!</h3>
              <p className="text-sm text-muted-foreground">
                This feature is under development and will be available in a future update.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={closeModal} className="flex-1">
                Close
              </Button>
              <Button 
                onClick={() => {
                  closeModal();
                  onNavigate?.('/home');
                }}
                className="flex-1"
                data-testid="button-back-to-home-modal"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}