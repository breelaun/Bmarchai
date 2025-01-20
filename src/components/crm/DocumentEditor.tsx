import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  PlusCircle, Save, Download, FileText, Settings, Table, 
  Image, BarChart2, LineChart, PieChart, BarChart, Edit,
  Trash2, MoveVertical, Grid
} from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  AreaChart as RechartsAreaChart,
  ScatterChart as RechartsScatterChart,
  Bar, Line, Pie, Area, Scatter,
  XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, Cell 
} from 'recharts';

const CHART_TYPES = {
  bar: 'Bar Chart',
  line: 'Line Chart',
  pie: 'Pie Chart',
  area: 'Area Chart',
  scatter: 'Scatter Plot'
};

const COLOR_SCHEMES = {
  default: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#4680ff'],
  warm: ['#ff7300', '#ff9500', '#ffb700', '#ffd900', '#fffc00'],
  cool: ['#00c5ff', '#0099ff', '#0066ff', '#0033ff', '#0000ff'],
  pastel: ['#ffb3ba', '#baffc9', '#bae1ff', '#ffffba', '#ffdfba']
};

const DocumentEditor = () => {
  const [document, setDocument] = useState({
    title: 'Untitled Document',
    content: [],
    lastSaved: null
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [chartDialog, setChartDialog] = useState(false);
  const [editingChartIndex, setEditingChartIndex] = useState(null);
  
  const [chartSettings, setChartSettings] = useState({
    type: 'bar',
    title: '',
    data: [
      { name: 'Category 1', value: 0 },
      { name: 'Category 2', value: 0 },
      { name: 'Category 3', value: 0 }
    ],
    colorScheme: 'default',
    size: { width: 500, height: 300 },
    showGrid: true,
    showLegend: true,
    animation: true
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(document.content);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setDocument(prev => ({ ...prev, content: items }));
  };

  const editChart = (index) => {
    setEditingChartIndex(index);
    setChartSettings(document.content[index]);
    setChartDialog(true);
  };

  const deleteChart = (index) => {
    const newContent = [...document.content];
    newContent.splice(index, 1);
    setDocument(prev => ({ ...prev, content: newContent }));
  };

  const ChartComponent = ({ type, data, title, settings, className = "" }) => {
    const { size, colorScheme, showGrid, showLegend, animation } = settings || chartSettings;
    const colors = COLOR_SCHEMES[colorScheme || 'default'];

    const commonProps = {
      width: size.width,
      height: size.height,
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
    };

    const commonCartesian = showGrid ? <CartesianGrid strokeDasharray="3 3" /> : null;

        switch (type) {
          case 'line':
            return (
              <div className={`${className} p-4`}>
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <RechartsLineChart {...commonProps} data={data}>
                 {showGrid && <CartesianGrid strokeDasharray="3 3" />}
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  {showLegend && <Legend />}
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={colors[0]} 
                    dot={{ fill: colors[0] }}
                    animationDuration={animation ? 1500 : 0}
                  />
                </RechartsLineChart>
              </div>
            );

          case 'pie':
            return (
              <div className={`${className} p-4`}>
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <RechartsPieChart {...commonProps}>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, value }) => `${name} (${value})`}
                    outerRadius={Math.min(size?.width || 500, size?.height || 300) / 3}
                    animationDuration={animation ? 1500 : 0}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={colors[index % colors.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  {showLegend && <Legend />}
                </RechartsPieChart>
              </div>
            );

    switch (type) {
      case 'bar':
        return (
          <div className={`${className} p-4`}>
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <RechartsBarChart {...commonProps} data={data}>
              {commonCartesian}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              <Bar dataKey="value" fill={colors[0]} animationDuration={animation ? 1500 : 0} />
            </RechartsBarChart>
          </div>
        );
      
      case 'line':
        return (
          <div className={`${className} p-4`}>
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <RechartsLineChart {...commonProps} data={data}>
              {commonCartesian}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              <Line type="monotone" dataKey="value" stroke={colors[0]} animationDuration={animation ? 1500 : 0} />
            </RechartsLineChart>
          </div>
        );
      
      case 'area':
        return (
          <div className={`${className} p-4`}>
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <RechartsAreaChart {...commonProps} data={data}>
              {commonCartesian}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              <Area type="monotone" dataKey="value" fill={colors[0]} stroke={colors[0]} animationDuration={animation ? 1500 : 0} />
            </RechartsAreaChart>
          </div>
        );
      
      case 'scatter':
        return (
          <div className={`${className} p-4`}>
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <RechartsScatterChart {...commonProps}>
              {commonCartesian}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              <Scatter data={data} fill={colors[0]} animationDuration={animation ? 1500 : 0} />
            </RechartsScatterChart>
          </div>
        );
      
      case 'pie':
        return (
          <div className={`${className} p-4`}>
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <RechartsPieChart {...commonProps}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={Math.min(size.width, size.height) / 3}
                fill="#8884d8"
                dataKey="value"
                animationDuration={animation ? 1500 : 0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              {showLegend && <Legend />}
            </RechartsPieChart>
          </div>
        );
      
      default:
        return null;
    }
  };

  const addChartToDocument = () => {
    const newContent = [...document.content];
    if (editingChartIndex !== null) {
      newContent[editingChartIndex] = { ...chartSettings };
    } else {
      newContent.push({ ...chartSettings });
    }
    setDocument(prev => ({ ...prev, content: newContent }));
    setChartDialog(false);
    setEditingChartIndex(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <Card className="bg-background border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Document Editor</CardTitle>
            <div className="flex gap-2">
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
            <Input 
              placeholder="Document Title"
              value={document.title}
              onChange={(e) => setDocument(prev => ({ ...prev, title: e.target.value }))}
              className="text-lg font-semibold bg-secondary"
            />
            
            <div className="flex gap-2">
              <Dialog open={chartDialog} onOpenChange={setChartDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <BarChart2 className="h-4 w-4" />
                    Add Chart
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingChartIndex !== null ? 'Edit Chart' : 'Create Chart'}
                    </DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue={chartSettings.type}>
                    <TabsList className="grid grid-cols-5 gap-4">
                      {Object.entries(CHART_TYPES).map(([type, label]) => (
                        <TabsTrigger
                          key={type}
                          value={type}
                          onClick={() => setChartSettings(prev => ({ ...prev, type }))}
                        >
                          {label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    <div className="mt-4 space-y-4">
                      <Input
                        placeholder="Chart Title"
                        value={chartSettings.title}
                        onChange={(e) => setChartSettings(prev => ({
                          ...prev,
                          title: e.target.value
                        }))}
                      />
                      
                      <div className="space-y-2">
                        {chartSettings.data.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="Category Name"
                              value={item.name}
                              onChange={(e) => {
                                const newData = [...chartSettings.data];
                                newData[index].name = e.target.value;
                                setChartSettings(prev => ({ ...prev, data: newData }));
                              }}
                            />
                            <Input
                              type="number"
                              placeholder="Value"
                              value={item.value}
                              onChange={(e) => {
                                const newData = [...chartSettings.data];
                                newData[index].value = parseFloat(e.target.value);
                                setChartSettings(prev => ({ ...prev, data: newData }));
                              }}
                            />
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => setChartSettings(prev => ({
                            ...prev,
                            data: [...prev.data, { name: `Category ${prev.data.length + 1}`, value: 0 }]
                          }))}
                        >
                          Add Data Point
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <label className="text-sm">Color Scheme:</label>
                          <Select
                            value={chartSettings.colorScheme}
                            onValueChange={(value) => setChartSettings(prev => ({
                              ...prev,
                              colorScheme: value
                            }))}
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(COLOR_SCHEMES).map(scheme => (
                                <SelectItem key={scheme} value={scheme}>
                                  {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm">Chart Size:</label>
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <span className="text-xs">Width: {chartSettings.size.width}px</span>
                              <Slider
                                value={[chartSettings.size.width]}
                                min={300}
                                max={800}
                                step={50}
                                onValueChange={([width]) => setChartSettings(prev => ({
                                  ...prev,
                                  size: { ...prev.size, width }
                                }))}
                              />
                            </div>
                            <div className="flex-1">
                              <span className="text-xs">Height: {chartSettings.size.height}px</span>
                              <Slider
                                value={[chartSettings.size.height]}
                                min={200}
                                max={600}
                                step={50}
                                onValueChange={([height]) => setChartSettings(prev => ({
                                  ...prev,
                                  size: { ...prev.size, height }
                                }))}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={chartSettings.showGrid}
                              onChange={(e) => setChartSettings(prev => ({
                                ...prev,
                                showGrid: e.target.checked
                              }))}
                            />
                            Show Grid
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={chartSettings.showLegend}
                              onChange={(e) => setChartSettings(prev => ({
                                ...prev,
                                showLegend: e.target.checked
                              }))}
                            />
                            Show Legend
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={chartSettings.animation}
                              onChange={(e) => setChartSettings(


                                
  // Generic chart editor component that works for all chart types
  const ChartEditor = ({ type, settings, onChange }) => {
    return (
      <div className="space-y-4">
        <Input
          placeholder="Chart Title"
          value={settings.title}
          onChange={(e) => onChange({ ...settings, title: e.target.value })}
        />
        
        {/* Data Input Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Data Points</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange({
                ...settings,
                data: [...settings.data, { name: `Point ${settings.data.length + 1}`, value: 0 }]
              })}
            >
              Add Data Point
            </Button>
          </div>
          
          {settings.data.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                placeholder={type === 'scatter' ? "X Value" : "Category Name"}
                value={item.name}
                onChange={(e) => {
                  const newData = [...settings.data];
                  newData[index].name = e.target.value;
                  onChange({ ...settings, data: newData });
                }}
              />
              <Input
                type="number"
                placeholder={type === 'scatter' ? "Y Value" : "Value"}
                value={item.value}
                onChange={(e) => {
                  const newData = [...settings.data];
                  newData[index].value = parseFloat(e.target.value) || 0;
                  onChange({ ...settings, data: newData });
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newData = settings.data.filter((_, i) => i !== index);
                  onChange({ ...settings, data: newData });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Style Options */}
        <div className="space-y-4 border rounded-lg p-4">
          <h3 className="text-sm font-medium">Chart Style</h3>
          
          <div className="flex items-center gap-4">
            <label className="text-sm">Color Scheme:</label>
            <Select
              value={settings.colorScheme}
              onValueChange={(value) => onChange({ ...settings, colorScheme: value })}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(COLOR_SCHEMES).map(scheme => (
                  <SelectItem key={scheme} value={scheme}>
                    {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm block">Chart Size</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs">Width: {settings.size.width}px</span>
                <Slider
                  value={[settings.size.width]}
                  min={300}
                  max={800}
                  step={50}
                  onValueChange={([width]) => onChange({
                    ...settings,
                    size: { ...settings.size, width }
                  })}
                />
              </div>
              <div>
                <span className="text-xs">Height: {settings.size.height}px</span>
                <Slider
                  value={[settings.size.height]}
                  min={200}
                  max={600}
                  step={50}
                  onValueChange={([height]) => onChange({
                    ...settings,
                    size: { ...settings.size, height }
                  })}
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.showGrid}
                onChange={(e) => onChange({
                  ...settings,
                  showGrid: e.target.checked
                })}
              />
              Show Grid
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.showLegend}
                onChange={(e) => onChange({
                  ...settings,
                  showLegend: e.target.checked
                })}
              />
              Show Legend
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.animation}
                onChange={(e) => onChange({
                  ...settings,
                  animation: e.target.checked
                })}
              />
              Enable Animation
            </label>
          </div>
        </div>
        
        {/* Preview */}
        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium mb-4">Preview</h3>
          <ChartComponent
            type={type}
            data={settings.data}
            title={settings.title}
            settings={settings}
            className="bg-secondary rounded-lg"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* ... (previous header content remains the same) */}
      
      <Dialog open={chartDialog} onOpenChange={setChartDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <BarChart2 className="h-4 w-4" />
            Add Chart
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingChartIndex !== null ? 'Edit Chart' : 'Create Chart'}
            </DialogTitle>
          </DialogHeader>
          <Tabs defaultValue={chartSettings.type}>
            <TabsList className="grid grid-cols-5 gap-4">
              {Object.entries(CHART_TYPES).map(([type, { name, icon: Icon }]) => (
                <TabsTrigger
                  key={type}
                  value={type}
                  className="flex gap-2 items-center"
                  onClick={() => setChartSettings(prev => ({ ...prev, type }))}
                >
                  <Icon className="h-4 w-4" />
                  {name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.keys(CHART_TYPES).map((type) => (
              <TabsContent key={type} value={type}>
                <ChartEditor
                  type={type}
                  settings={chartSettings}
                  onChange={setChartSettings}
                />
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setChartDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addChartToDocument}>
                    {editingChartIndex !== null ? 'Update Chart' : 'Add to Document'}
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Document Content with Drag and Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="document">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {document.content.map((item, index) => (
                <Draggable key={index} draggableId={`chart-${index}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="relative group"
                    >
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => editChart(index)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteChart(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div {...provided.dragHandleProps}>
                          <Button variant="ghost" size="icon">
                            <MoveVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <ChartComponent
                        type={item.type}
                        data={item.data}
                        title={item.title}
                        settings={item}
                        className="bg-secondary rounded-lg"
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Textarea 
        placeholder="Start typing your document content here..."
        className="min-h-[400px] bg-secondary"
      />
    </div>
  );
};

export default DocumentEditor;
