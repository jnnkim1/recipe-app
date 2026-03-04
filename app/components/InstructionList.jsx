"use client";

import { useState, useEffect } from "react";

export default function InstructionList({ value = null, onChange = null }) {
  const [instructions, setInstructions] = useState([{ step: "" }]);

  useEffect(() => {
    if (value) {
      setInstructions(value);
    }
  }, [value]);

  const handleChange = (index, val) => {
    const updated = [...instructions];
    updated[index].step = val;
    setInstructions(updated);
    if (onChange) {
      onChange(updated);
    }
  };

  const addInstruction = () => {
    const updated = [...instructions, { step: "" }];
    setInstructions(updated);
    if (onChange) {
      onChange(updated);
    }
  };

  const removeInstruction = (index) => {
    const updated = instructions.filter((_, i) => i !== index);
    setInstructions(updated);
    if (onChange) {
      onChange(updated);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {instructions.map((instruction, index) => (
        <div key={index} className="flex gap-4 items-center">
          <input
            type="text"
            value={instruction.step}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder={`Step ${index + 1}`}
            className="w-full bg-[#F5BAA7] rounded-xl border-2 border-[#D17368] px-4 py-3 focus:ring-2 focus:ring-[#D17368] focus:outline-none"
            required
          />

          {instructions.length > 1 && (
            <button
              type="button"
              onClick={() => removeInstruction(index)}
              className="text-red-500 font-semibold"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addInstruction}
        className="self-start text-[#D17368] font-semibold underline mt-2 ml-2 cursor-pointer"
      >
        + Add Instruction
      </button>
    </div>
  );
}
