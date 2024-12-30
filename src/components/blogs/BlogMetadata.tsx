import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BlogFormData } from "@/types/blog";

interface BlogMetadataProps {
  form: UseFormReturn<BlogFormData>;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'zh', name: 'Chinese (中文)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'ko', name: 'Korean (한국어)' },
  { code: 'th', name: 'Thai (ไทย)' },
  { code: 'tl', name: 'Tagalog' },
  { code: 'vi', name: 'Vietnamese (Tiếng Việt)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'it', name: 'Italian (Italiano)' },
  { code: 'pt', name: 'Portuguese (Português)' },
  { code: 'ru', name: 'Russian (Русский)' },
  { code: 'tr', name: 'Turkish (Türkçe)' },
  { code: 'pl', name: 'Polish (Polski)' },
  { code: 'uk', name: 'Ukrainian (Українська)' },
  { code: 'nl', name: 'Dutch (Nederlands)' },
  { code: 'el', name: 'Greek (Ελληνικά)' },
  { code: 'he', name: 'Hebrew (עברית)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'ur', name: 'Urdu (اردو)' },
  { code: 'fa', name: 'Persian (فارسی)' },
  { code: 'id', name: 'Indonesian (Bahasa Indonesia)' },
  { code: 'ms', name: 'Malay (Bahasa Melayu)' },
  { code: 'sw', name: 'Swahili (Kiswahili)' },
  { code: 'am', name: 'Amharic (አማርኛ)' },
  { code: 'km', name: 'Khmer (ខ្មែរ)' },
  { code: 'my', name: 'Burmese (မြန်မာ)' },
  { code: 'si', name: 'Sinhala (සිංහල)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'ml', name: 'Malayalam (മലയാളം)' },
  { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'mr', name: 'Marathi (मराठी)' },
  { code: 'ne', name: 'Nepali (नेपाली)' },
  { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'sd', name: 'Sindhi (سنڌي)' },
  { code: 'ha', name: 'Hausa (Hausa)' },
  { code: 'yo', name: 'Yoruba (Yorùbá)' },
  { code: 'ig', name: 'Igbo (Igbo)' },
  { code: 'zu', name: 'Zulu (isiZulu)' },
  { code: 'xh', name: 'Xhosa (isiXhosa)' },
  { code: 'st', name: 'Sotho (Sesotho)' },
  { code: 'ny', name: 'Chichewa (Chichewa)' },
  { code: 'mg', name: 'Malagasy (Malagasy)' },
  { code: 'eu', name: 'Basque (Euskara)' },
  { code: 'ca', name: 'Catalan (Català)' }
];

const fonts = [
  { value: 'inter', name: 'Inter', className: 'font-sans' },
  { value: 'poppins', name: 'Poppins', className: 'font-heading' },
  { value: 'roboto-mono', name: 'Roboto Mono', className: 'font-mono' },
  { value: 'playfair', name: 'Playfair Display', className: 'font-playfair' },
  { value: 'merriweather', name: 'Merriweather', className: 'font-merriweather' },
  { value: 'lora', name: 'Lora', className: 'font-lora' },
  { value: 'montserrat', name: 'Montserrat', className: 'font-montserrat' },
  { value: 'raleway', name: 'Raleway', className: 'font-raleway' },
  { value: 'oswald', name: 'Oswald', className: 'font-oswald' },
  { value: 'quicksand', name: 'Quicksand', className: 'font-quicksand' },
  { value: 'fira-code', name: 'Fira Code', className: 'font-fira' },
  { value: 'source-code-pro', name: 'Source Code Pro', className: 'font-source-code' },
  { value: 'crimson', name: 'Crimson Pro', className: 'font-crimson' },
  { value: 'libre-baskerville', name: 'Libre Baskerville', className: 'font-libre' },
  { value: 'nunito', name: 'Nunito', className: 'font-nunito' },
  { value: 'space-grotesk', name: 'Space Grotesk', className: 'font-space' },
  { value: 'dm-sans', name: 'DM Sans', className: 'font-dm-sans' },
  { value: 'josefin-sans', name: 'Josefin Sans', className: 'font-josefin' },
  { value: 'archivo', name: 'Archivo', className: 'font-archivo' },
  { value: 'work-sans', name: 'Work Sans', className: 'font-work' }
];

const BlogMetadata = ({ form }: BlogMetadataProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Input placeholder="Enter category" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags (comma-separated)</FormLabel>
            <FormControl>
              <Input placeholder="tag1, tag2, tag3" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="language"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Language</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-background border-border max-h-[300px]">
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="font_family"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Font</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-background border-border">
                {fonts.map((font) => (
                  <SelectItem 
                    key={font.value} 
                    value={font.value}
                    className={font.className}
                  >
                    {font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="is_private"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Private Post</FormLabel>
              <div className="text-sm text-muted-foreground">
                Make this post private and visible only to you
              </div>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default BlogMetadata;