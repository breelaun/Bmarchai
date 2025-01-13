import type { TemplateStyleConfig, TemplateLayoutConfig } from "../types/vendor-setup";

export interface VendorTemplate {
  id: number;
  name: string;
  description: string | null;
  style_config: TemplateStyleConfig;
  layout_config: TemplateLayoutConfig;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}