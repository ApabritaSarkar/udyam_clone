export type Field = {
    id: string;
    name: string;
    type: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    pattern?: string;
    options?: { value: string; label: string }[];
  };
  
  export type Step = { step: number; name: string; fields: Field[] };
  
  export type UdyamSchema = {
    source: string;
    scrapedAt: string;
    steps: Step[];
  };
  