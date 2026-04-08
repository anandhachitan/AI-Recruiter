import React from "react";
import { MessageSquare, Quote, BrainCircuit, Zap, Sparkles, LayoutList } from "lucide-react";

function QuestionListContainer({ questionList }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <LayoutList className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-800 tracking-tight">AI-Generated Curriculum</h3>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-0.5">Customized for your job description</p>
          </div>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-blue-600 fill-blue-600" />
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{questionList?.length} Questions</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {questionList.map((item, index) => (
          <div
            key={index}
            className="group relative bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-50/50 hover:border-blue-100 transition-all duration-500 overflow-hidden"
          >
            <div className="flex items-start gap-6 relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:shadow-lg group-hover:shadow-blue-200 shrink-0">
                <span className="text-sm font-black tracking-tighter">Q{index + 1}</span>
              </div>
              <div className="flex-1 pt-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">
                    {item.type}
                  </span>
                  <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-widest border border-gray-100">
                    Priority High
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 leading-relaxed group-hover:text-blue-600 transition-colors duration-300">
                  {item.question}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-xl flex items-center justify-center text-gray-100 group-hover:text-blue-100 transition-colors duration-500 shrink-0">
                <Quote className="h-6 w-6 rotate-180" />
              </div>
            </div>

            {/* Decorative Background Shape */}
            <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionListContainer;
