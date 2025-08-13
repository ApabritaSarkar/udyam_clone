"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// --- Mock Schema Data (Replaced external import) ---
// In a real application, you would load this from a JSON file or API.
// This is a simplified mock to make the component runnable in this environment.
const schemaData = {
  "steps": [
    {
      "step": 1,
      "name": "Aadhaar & OTP Validation",
      "fields": [
        {
          "id": "aadhaarNumber",
          "name": "aadhaarNumber",
          "label": "Aadhaar Number",
          "type": "text",
          "placeholder": "Enter your 12-digit Aadhaar Number",
          "required": true,
          "validation": { "regex": "^[0-9]{12}$", "message": "Invalid Aadhaar Number" }
        },
        {
          "id": "aadhaarName",
          "name": "aadhaarName",
          "label": "Name as per Aadhaar",
          "type": "text",
          "placeholder": "Enter your name as per Aadhaar",
          "required": true
        },
        {
          "id": "otp",
          "name": "otp",
          "label": "OTP",
          "type": "text",
          "placeholder": "Enter OTP received on Aadhaar registered mobile",
          "required": true,
          "validation": { "regex": "^[0-9]{6}$", "message": "Invalid OTP" }
        }
      ]
    },
    {
      "step": 2,
      "name": "PAN Validation & Business Details",
      "fields": [
        {
          "id": "panNumber",
          "name": "panNumber",
          "label": "PAN Number",
          "type": "text",
          "placeholder": "Enter your 10-character PAN",
          "required": true,
          "validation": { "regex": "^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$", "message": "Invalid PAN format (e.g., ABCDE1234F)" }
        },
        {
          "id": "organizationName",
          "name": "organizationName",
          "label": "Name of Organization",
          "type": "text",
          "placeholder": "Enter your organization's name",
          "required": true
        },
        {
          "id": "businessType",
          "name": "businessType",
          "label": "Type of Business",
          "type": "select",
          "required": true,
          "options": [
            { "label": "Manufacturing", "value": "manufacturing" },
            { "label": "Service", "value": "service" },
            { "label": "Trading", "value": "trading" }
          ]
        },
        {
            "id": "addressLine1",
            "name": "addressLine1",
            "label": "Address Line 1",
            "type": "text",
            "placeholder": "Building, Street, Area",
            "required": true
        },
        {
            "id": "pincode",
            "name": "pincode",
            "label": "PIN Code",
            "type": "text",
            "placeholder": "e.g., 110001",
            "required": true,
            "validation": { "regex": "^[0-9]{6}$", "message": "Invalid PIN Code" }
        },
        {
            "id": "city",
            "name": "city",
            "label": "City",
            "type": "text",
            "placeholder": "Auto-filled based on PIN",
            "required": true
        },
        {
            "id": "state",
            "name": "state",
            "label": "State",
            "type": "text",
            "placeholder": "Auto-filled based on PIN",
            "required": true
        },
        {
            "id": "termsAndConditions",
            "name": "termsAndConditions",
            "label": "I agree to the Terms and Conditions",
            "type": "checkbox",
            "required": true,
            "placeholder": "Please agree to the terms and conditions"
        }
      ]
    }
  ]
};

// --- Mock detectRule function (Replaced external import) ---
// This function mimics the behavior of the original detectRule to apply regex validation.
function detectRule(field: any) {
  if (field.validation && field.validation.regex) {
    return {
      regex: new RegExp(field.validation.regex),
      message: field.validation.message || `Invalid format for ${field.label || field.name}`
    };
  }
  return null;
}

// Basic type definition for the simplified schema
type UdyamSchema = typeof schemaData;

const schema = schemaData as UdyamSchema;

export default function FormRenderer() {
  const [stepIndex, setStepIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(false); // New loading state
  const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null); // New message state for custom modal
  
  const steps = schema.steps;
  const step = steps[stepIndex];

  // Build Zod schema for current step
  const zodShape: Record<string, z.ZodTypeAny> = {};

  step.fields
    .filter(f => !f.id.startsWith("__")) // skip hidden/system fields
    .forEach((f) => {
      let rule: any;

      if (f.type === "checkbox") {
        rule = z.literal(true, { message: `${f.label || f.name} must be checked` });
      } else {
        rule = z.string();
        if (f.required) {
          rule = rule.min(1, `${f.label || f.name} is required`);
        }
      }

      const detected = detectRule(f);
      if (detected) {
        rule = rule.regex(detected.regex, detected.message);
      }

      zodShape[f.name || f.id] = rule;
    });

  const formSchema = z.object(zodShape);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(formSchema) });

  const onSubmit = async (data: Record<string, any>) => {
    console.log("Step data:", data);

    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setLoading(true); // Set loading to true when submission starts
      try {
        // Mock API call to simulate network request
        // In a real application, you'd replace this with your actual backend API endpoint
        // const res = await fetch(process.env.NEXT_PUBLIC_API_BASE + "/submit", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ step: step.step, data })
        // });

        // Simulating a successful API response after a delay
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

        // Example of a successful response
        setMessage({ type: 'success', text: "Form data sent to server successfully!" });

        // Example of an error response (uncomment to test error path)
        // throw new Error("Simulated server error");

      } catch (error: any) {
        console.error(error);
        setMessage({ type: 'error', text: `Network error: ${error.message || 'Please try again.'}` }); // Use custom message
      } finally {
        setLoading(false); // Set loading to false when submission ends
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">
              Step {stepIndex + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((stepIndex + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">{step.name}</h2>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            {step.fields
              .filter(f => !f.id.startsWith("__")) // skip hidden/system fields
              .map((f) => (
                <div key={f.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {f.label || f.name}
                    {f.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {f.type === "select" ? (
                    <select 
                      {...register(f.name || f.id)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white text-gray-900"
                    >
                      <option value="">Select an option...</option>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : f.type === "checkbox" ? (
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        {...register(f.name || f.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-600">{f.placeholder}</span>
                    </div>
                  ) : f.type === "textarea" ? (
                    <textarea
                      placeholder={f.placeholder}
                      rows={4}
                      {...register(f.name || f.id)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-vertical"
                    />
                  ) : (
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      {...register(f.name || f.id)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  )}
                  
                  {errors[f.name || f.id] && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm">
                        {String(errors[f.name || f.id]?.message)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setStepIndex(stepIndex - 1)}
                  className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                  disabled={loading} // Disable previous button when loading
                >
                  Previous
                </button>
              )}
              
              <button 
                type="submit"
                className={`ml-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                  ${loading ? 'opacity-70 cursor-not-allowed' : ''}`} // Add disabled styling
                disabled={loading} // Disable button when loading
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  stepIndex < steps.length - 1 ? "Next Step" : "Submit Form"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Custom Message Modal */}
        {message && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className={`relative p-5 border w-96 shadow-lg rounded-md ${message.type === 'success' ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
              <div className="mt-3 text-center">
                <h3 className={`text-lg leading-6 font-medium ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {message.type === 'success' ? 'Success!' : 'Error!'}
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className={`text-sm ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                    {message.text}
                  </p>
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    onClick={() => setMessage(null)}
                    className={`px-4 py-2 ${message.type === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white text-base font-medium rounded-md w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
