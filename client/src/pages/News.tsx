import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GameHeader from "@/components/GameHeader";
import BottomTabBar from "@/components/BottomTabBar";
import { ArrowLeft, Clock, CheckCheck } from "lucide-react";
import { news, type NewsArticle } from "@/utils/localStorage";

interface NewsProps {
  onNavigate?: (path: string) => void;
}

const defaultNews: NewsArticle[] = [
  {
    id: "1",
    title: "Local High School Basketball Season Kicks Off",
    body: "The highly anticipated high school basketball season has officially begun with exciting matchups scheduled across the region. Teams are looking stronger than ever this year.",
    dateISO: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: "2", 
    title: "Basketball Training Camp Opens Registration",
    body: "Elite basketball training camp is now accepting applications for this summer. The camp focuses on developing fundamental skills and basketball IQ.",
    dateISO: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: "3",
    title: "New Basketball Equipment Rules Announced",
    body: "The league has announced new equipment regulations that will take effect next season. Players should review the updated guidelines for approved gear.",
    dateISO: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    read: true
  },
  {
    id: "4",
    title: "Scholarship Opportunities for Student Athletes",
    body: "Several colleges are actively recruiting high school basketball players. Academic performance and basketball skills are key factors in the selection process.",
    dateISO: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: "5",
    title: "Sports Medicine Workshop for Athletes",
    body: "Learn about injury prevention, proper nutrition, and recovery techniques in this comprehensive workshop designed for young athletes.",
    dateISO: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    read: true
  },
  {
    id: "6",
    title: "Basketball Analytics: The Future of the Game",
    body: "How data and statistics are revolutionizing basketball strategy and player development. Understanding your performance metrics can give you a competitive edge.",
    dateISO: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    read: false
  }
];

export default function News({ onNavigate }: NewsProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    let savedNews = news.get();
    if (savedNews.length === 0) {
      // Initialize with default news if none exists
      news.set(defaultNews);
      savedNews = defaultNews;
    }
    setArticles(savedNews);
  }, []);

  const formatDate = (dateISO: string) => {
    const date = new Date(dateISO);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handleMarkAllRead = () => {
    news.markAllRead();
    setArticles(articles.map(article => ({ ...article, read: true })));
  };

  const handleArticleClick = (articleId: string) => {
    news.markRead(articleId);
    setArticles(articles.map(article => 
      article.id === articleId ? { ...article, read: true } : article
    ));
  };

  const unreadCount = articles.filter(article => !article.read).length;

  return (
    <div className="min-h-screen bg-background">
      <GameHeader />
      
      <main className="px-4 pt-4 pb-20 max-w-2xl mx-auto">
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
            <h1 className="text-2xl font-bold">Basketball News</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Stay updated with the latest basketball news and announcements
          </p>
        </div>

        {unreadCount > 0 && (
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={handleMarkAllRead}
              className="w-full"
              data-testid="button-mark-all-read"
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {articles.map((article) => (
            <Card 
              key={article.id}
              className={`cursor-pointer hover-elevate transition-all duration-200 ${
                !article.read ? 'border-primary/50 bg-primary/5' : ''
              }`}
              onClick={() => handleArticleClick(article.id)}
              data-testid={`news-article-${article.id}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base leading-tight flex-1">
                    {article.title}
                    {!article.read && (
                      <div className="w-2 h-2 rounded-full bg-primary inline-block ml-2" />
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <Clock className="w-3 h-3" />
                    {formatDate(article.dateISO)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {article.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No News Available</h3>
            <p className="text-sm text-muted-foreground">
              Check back later for the latest basketball news and updates.
            </p>
          </div>
        )}
      </main>

      <BottomTabBar />
    </div>
  );
}