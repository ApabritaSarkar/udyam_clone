"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import schemaData from "../../udyam_schema.json";
import { detectRule } from "../../lib/validation";
import type { UdyamSchema } from "../../lib/types";
import toast, { Toaster } from "react-hot-toast";

const schema = schemaData as UdyamSchema;

export default function FormRenderer() {
  const [stepIndex, setStepIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const steps = schema.steps;
  const step = steps[stepIndex];

  // Build Zod schema for current step
  const zodShape: Record<string, z.ZodTypeAny> = {};

  step.fields
    .filter(f => !f.id.startsWith("__"))
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
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      try {
        setLoading(true);

        const res = await fetch(process.env.NEXT_PUBLIC_API_BASE + "/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ step: step.step, data })
        });

        if (!res.ok) {
          const err = await res.json();
          toast.error("Error: " + JSON.stringify(err));
        } else {
          toast.success("✅ Form submitted successfully!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Network error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <Toaster position="top-right" />
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
              .filter(f => !f.id.startsWith("__"))
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
                      <p className="text-sm">{String(errors[f.name || f.id]?.message)}</p>
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
                >
                  Previous
                </button>
              )}

              <button 
                type="submit"
                disabled={loading}
                className={`ml-auto px-8 py-3 text-white rounded-lg transition-all duration-200 font-medium shadow-lg transform hover:-translate-y-0.5
                  ${loading 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                  }`}
              >
                {loading 
                  ? "Submitting..." 
                  : stepIndex < steps.length - 1 
                    ? "Next Step" 
                    : "Submit Form"
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
