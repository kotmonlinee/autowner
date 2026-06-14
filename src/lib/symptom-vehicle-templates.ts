// Template definitions for vehicle-specific symptom articles
// 22 vehicles × 58 symptoms = 1,276 articles

export interface CategoryTemplate {
  /** SEO title pattern: {vehicle} = "Toyota Camry", {symptom} = "ABS Light On" */
  title: string;
  /** H1 question format */
  h1: string;
  /** Meta description pattern */
  meta: string;
}

export const CATEGORY_TEMPLATES: Record<string, CategoryTemplate> = {
  noise: {
    title: "{vehicle} {symptom}: What It Means & Repair Cost",
    h1: "What's Causing {symptom} in My {vehicle}?",
    meta: "Hearing {symptom} in your {vehicle}? Learn the most common causes, expected repair costs, and whether it's safe to keep driving. Expert diagnosis tips included.",
  },
  smells: {
    title: "{vehicle} {symptom}: Causes, Repair Cost & Is It Dangerous?",
    h1: "Why Does My {vehicle} Have {symptom}?",
    meta: "Smelling {symptom} in your {vehicle}? Learn what causes it, how much repairs cost, and whether it indicates a serious safety issue. Diagnosis guide included.",
  },
  smoke: {
    title: "{vehicle} {symptom}: Causes, Repair Cost & Is It Dangerous?",
    h1: "Why Is My {vehicle} Blowing {symptom}?",
    meta: "Seeing {symptom} from your {vehicle}? Learn the common causes, expected repair costs, and whether it's safe to continue driving. Expert diagnosis guide included.",
  },
  vibration: {
    title: "{vehicle} {symptom}: Causes, Repair Cost & Is It Safe to Drive?",
    h1: "Why Is My {vehicle} {symptom}?",
    meta: "Experiencing {symptom} in your {vehicle}? Learn the most common causes, expected repair costs, and whether it's safe to continue driving. Diagnosis tips included.",
  },
  starting: {
    title: "{vehicle} {symptom}: Most Common Causes & What to Check First",
    h1: "Why Is My {vehicle} {symptom}?",
    meta: "{symptom} with your {vehicle}? Learn the most common causes, diagnostic steps, and expected repair costs to get back on the road quickly.",
  },
  performance: {
    title: "{vehicle} {symptom}: Causes, Repair Cost & What to Do",
    h1: "Why Is My {vehicle} {symptom}?",
    meta: "Experiencing {symptom} in your {vehicle}? Learn the common causes, expected repair costs, and what to do next. Expert diagnosis guide included.",
  },
  warning_lights: {
    title: "{vehicle} {symptom}: Causes, Repair Cost & Warning Signs",
    h1: "Why Is My {vehicle} {symptom}?",
    meta: "The {symptom} is on in your {vehicle}. Learn what it means, common causes, expected repair costs, and whether it's safe to keep driving.",
  },
  temperature: {
    title: "{vehicle} {symptom}: Common Causes & When to Stop Driving",
    h1: "Why Is My {vehicle} {symptom}?",
    meta: "Your {vehicle} is {symptom}. Learn the common causes, expected repair costs, and when to stop driving. Expert diagnosis tips included.",
  },
  leaks: {
    title: "{vehicle} {symptom}: Common Causes, Repair Cost & How to Identify",
    h1: "Why Is My {vehicle} Leaking Fluid? {symptom}",
    meta: "Noticed {symptom} under your {vehicle}? Learn how to identify the fluid, common causes, expected repair costs, and whether it's safe to drive.",
  },
  brakes: {
    title: "{vehicle} {symptom}: Causes, Repair Cost & Safety Warning",
    h1: "Why Is My {vehicle} {symptom}?",
    meta: "Experiencing {symptom} in your {vehicle}? Learn the common causes, expected repair costs, and why brake issues should never be ignored. Safety-first diagnosis guide.",
  },
  steering: {
    title: "{vehicle} {symptom}: Causes, Repair Cost & Is It Safe to Drive?",
    h1: "Why Does My {vehicle} {symptom}?",
    meta: "Your {vehicle} is {symptom}. Learn the common causes, expected repair costs, and whether it's safe to continue driving. Expert alignment and suspension diagnosis tips.",
  },
};

// Default template for any category not explicitly defined
export const DEFAULT_TEMPLATE: CategoryTemplate = {
  title: "{vehicle} {symptom}: Causes, Repair Cost & Is It Safe to Drive?",
  h1: "Why Is My {vehicle} {symptom}?",
  meta: "Experiencing {symptom} in your {vehicle}? Learn the most common causes, expected repair costs, and whether it's safe to continue driving. Expert diagnosis tips included.",
};
