import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Star, Zap, Crown, Sparkles } from 'lucide-react';

export default function EliteThemeDemo() {
  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-elite text-4xl font-bold">Elite Design System</h1>
        <p className="text-muted-foreground">Premium color palette and sophisticated components</p>
      </div>

      {/* Elite Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="card-elite animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Premium Card
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Elite card with glass morphism effect and sophisticated styling.
            </p>
            <Button className="btn-elite w-full">
              <Star className="mr-2 h-4 w-4" />
              Elite Action
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-elite animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Glass Effect
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Stunning glass morphism with blur effects and premium gradients.
            </p>
            <div className="space-y-2">
              <Badge className="badge-elite">Premium</Badge>
              <Badge variant="secondary">Standard</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="chart-elite animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Elite Chart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Data visualization with premium styling and enhanced shadows.
            </p>
            <div className="h-20 bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
              <span className="text-elite text-lg font-semibold">Chart Area</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Elite Form Elements */}
      <Card className="card-elite">
        <CardHeader>
          <CardTitle>Elite Form Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Elite Input</label>
              <Input className="input-elite" placeholder="Premium input field..." />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Standard Input</label>
              <Input placeholder="Standard input field..." />
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button className="btn-elite">Premium Button</Button>
            <Button variant="outline">Standard Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </CardContent>
      </Card>

      {/* Elite Status Indicators */}
      <Card className="glass-elite">
        <CardHeader>
          <CardTitle>Elite Status System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center space-y-2">
              <div className="status-online h-4 w-4 rounded-full mx-auto" />
              <span className="text-xs">Online</span>
            </div>
            <div className="text-center space-y-2">
              <div className="h-4 w-4 rounded-full bg-warning mx-auto shadow-glow" />
              <span className="text-xs">Warning</span>
            </div>
            <div className="text-center space-y-2">
              <div className="h-4 w-4 rounded-full bg-destructive mx-auto shadow-glow" />
              <span className="text-xs">Error</span>
            </div>
            <div className="text-center space-y-2">
              <div className="h-4 w-4 rounded-full bg-info mx-auto shadow-glow" />
              <span className="text-xs">Info</span>
            </div>
            <div className="text-center space-y-2">
              <div className="h-4 w-4 rounded-full bg-muted mx-auto" />
              <span className="text-xs">Inactive</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Department Colors */}
      <Card className="card-elite">
        <CardHeader>
          <CardTitle>Elite Department Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-xl bg-sales mx-auto shadow-elite" />
              <span className="text-xs font-medium">Sales</span>
            </div>
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-xl bg-hr mx-auto shadow-elite" />
              <span className="text-xs font-medium">HR</span>
            </div>
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-xl bg-marketing mx-auto shadow-elite" />
              <span className="text-xs font-medium">Marketing</span>
            </div>
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-xl bg-manufacturing mx-auto shadow-elite" />
              <span className="text-xs font-medium">Manufacturing</span>
            </div>
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-xl bg-support mx-auto shadow-elite" />
              <span className="text-xs font-medium">Support</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}