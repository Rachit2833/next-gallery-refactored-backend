import { themes } from '@/app/_lib/themes';
import { ThemeCard } from '@/app/_MyComponents/ThemeCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import React from 'react';

const Page = () => {
  return (

      <Card className="shadow-xl border border-muted rounded-2xl mx-4 my-2">
        <CardHeader>
          <CardTitle className="text-2xl">Appearance</CardTitle>
          <CardDescription className="text-muted-foreground">
            Choose a theme that suits your personality or mood.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1  md:grid-cols-1 lg:grid-cols-2 gap-6">
            {themes.map((item, index) => (
              <ThemeCard key={index} theme={item} />
            ))}
          </div>
        </CardContent>
      </Card>

  );
};

export default Page;
