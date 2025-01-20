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
  Settings, Table, Image, BarChart2,
  LineChart, PieChart, BarChart
} from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const DocumentEditor = () => {
  const [document, setDocument] = useState({
    title: 'Untitled Document',
    content: [],
    lastSaved: null
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [tableDialog, setTableDialog] = useState(false);
  const [imageDialog, setImageDialog] = useState(false);
  const [chartDialog, setChartDialog] = useState(false);
  
  // Table state
  const [tableData, setTableData] = useState({
    rows: 3,
    cols: 3,
    headers: [],
    data: []
  });
  
  // Chart state
  const [chartData, setChartData] = useState({
    type: 'bar',
    title: '',
    data: [
      { name: 'Category 1', value: 0 },
      { name: 'Category 2', value: 0 },
      { name: 'Category 3', value: 0 }
    ]
  });

  const handleTableCreate = () => {
    const newData = {
      ...tableData,
      headers: Array(tableData.cols).fill('Header'),
      data: Array(tableData.rows).fill(Array(tableData.cols).fill(''))
    };
    setTableData(newData);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you'd handle file upload to your backend here
      // For demo, we'll just close the dialog
      setImageDialog(false);
    }
  };

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
              <Dialog open={tableDialog} onOpenChange={setTableDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Table className="h-4 w-4" />
                    Add Table
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create Table</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex gap-4">
                      <Input
                        type="number"
                        placeholder="Rows"
                        min="1"
                        value={tableData.rows}
                        onChange={(e) => setTableData(prev => ({
                          ...prev,
                          rows: parseInt(e.target.value)
                        }))}
                      />
                      <Input
                        type="number"
                        placeholder="Columns"
                        min="1"
                        value={tableData.cols}
                        onChange={(e) => setTableData(prev => ({
                          ...prev,
                          cols: parseInt(e.target.value)
                        }))}
                      />
                    </div>
                    <Button onClick={handleTableCreate}>Create Table</Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={imageDialog} onOpenChange={setImageDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Image className="h-4 w-4" />
                    Add Image
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Image</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={chartDialog} onOpenChange={setChartDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <BarChart2 className="h-4 w-4" />
                    Add Chart
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>Create Chart</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="bar">
                    <TabsList>
                      <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                      <TabsTrigger value="line">Line Chart</TabsTrigger>
                      <TabsTrigger value="pie">Pie Chart</TabsTrigger>
                    </TabsList>
                    <TabsContent value="bar" className="space-y-4">
                      <Input
                        placeholder="Chart Title"
                        value={chartData.title}
                        onChange={(e) => setChartData(prev => ({
                          ...prev,
                          title: e.target.value
                        }))}
                      />
                      <div className="space-y-2">
                        {chartData.data.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="Category Name"
                              value={item.name}
                              onChange={(e) => {
                                const newData = [...chartData.data];
                                newData[index].name = e.target.value;
                                setChartData(prev => ({ ...prev, data: newData }));
                              }}
                            />
                            <Input
                              type="number"
                              placeholder="Value"
                              value={item.value}
                              onChange={(e) => {
                                const newData = [...chartData.data];
                                newData[index].value = parseFloat(e.target.value);
                                setChartData(prev => ({ ...prev, data: newData }));
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="h-64">
                        <RechartsBarChart
                          width={500}
                          height={200}
                          data={chartData.data}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8884d8" />
                        </RechartsBarChart>
                      </div>
                      <Button>Add to Document</Button>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
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
