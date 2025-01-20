import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  PlusCircle, Save, Download, FileText,
  Settings, Table, Image, BarChart2
} from 'lucide-react';

const DocumentEditor = () => {
  const [document, setDocument] = useState({
    title: 'Untitled Document',
    content: [],
    lastSaved: null
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState('');

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <Card className="bg-background border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Document Editor</CardTitle>
            <div className="flex gap-2">
              <Select
                value={selectedTemplate}
                onValueChange={(value) => setSelectedTemplate(value)}
              >
                <SelectTrigger className="w-[200px] bg-secondary">
                  <SelectValue placeholder="Choose Template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realEstate">Real Estate Analysis</SelectItem>
                  <SelectItem value="financial">Financial Report</SelectItem>
                  <SelectItem value="marketing">Marketing Plan</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input 
                placeholder="Document Title"
                value={document.title}
                onChange={(e) => setDocument(prev => ({ ...prev, title: e.target.value }))}
                className="text-lg font-semibold bg-secondary"
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Add Text
              </Button>
              <Button variant="outline" className="gap-2">
                <Table className="h-4 w-4" />
                Add Table
              </Button>
              <Button variant="outline" className="gap-2">
                <Image className="h-4 w-4" />
                Add Image
              </Button>
              <Button variant="outline" className="gap-2">
                <BarChart2 className="h-4 w-4" />
                Add Chart
              </Button>
            </div>

            <Textarea 
              placeholder="Start typing your document content here..."
              className="min-h-[400px] bg-secondary"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentEditor;