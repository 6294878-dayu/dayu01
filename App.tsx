
import React, { useState } from 'react';
import Layout from './components/Layout';
import { AIModel, GenerationParams } from './types';
import { GIFT_TYPE_OPTIONS, SCENE_OPTIONS, STYLE_OPTIONS, COMPOSITION_OPTIONS, MODEL_OPTIONS } from './constants';
import { generateFloralCelebrationImages } from './services/geminiService';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [params, setParams] = useState<GenerationParams>({
    model: 'gemini-2.5-flash-image',
    giftType: 'bouquet',
    size: 35,
    scene: 'restaurant',
    style: 'elegant',
    composition: 'single'
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModelChange = (newModel: AIModel) => {
    setParams({ ...params, model: newModel });
    setError(null);
  };

  const handleGenerate = async () => {
    if (!image) return;
    setIsGenerating(true);
    setError(null);
    setResults([]);
    try {
      const generated = await generateFloralCelebrationImages(image, mimeType, params);
      setResults(generated);
      if (generated.length < 4) {
        setError('由于请求配额限制，仅为您生成了部分图片。您可以稍后再试以获得完整结果。');
      }
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 300);
    } catch (err: any) {
      console.error(err);
      if (err.message === "QUOTA_EXCEEDED") {
        setError('AI 摄影师目前太忙了（配额已满），请等待 1-2 分钟后再试。');
      } else {
        setError('生成失败，请检查网络或更换照片重试。');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResults([]);
    setError(null);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <section className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">定制您的庆生花卉大片</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            上传您的花束照片，AI 将为您合成精致的氛围感写真，完全免费使用。
          </p>
        </section>

        <section className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-1">
          {MODEL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleModelChange(opt.value)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${
                params.model === opt.value
                  ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md font-bold'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{opt.icon}</span>
              <div className="flex flex-col items-start leading-none text-left">
                <span className="text-sm">{opt.label}</span>
                <span className={`text-[10px] ${params.model === opt.value ? 'text-pink-100' : 'text-gray-400'}`}>
                  {opt.desc}
                </span>
              </div>
            </button>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <span className="bg-pink-100 text-pink-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              上传花束照片
            </h3>
            <div className="relative group">
              {image ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-pink-200 aspect-[3/4]">
                  <img src={image} className="w-full h-full object-cover" alt="Preview" />
                  <button 
                    onClick={reset}
                    className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                  >
                    <i className="fas fa-redo"></i>
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-[3/4] border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer bg-white hover:bg-gray-50 hover:border-pink-300 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="w-16 h-16 mb-4 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
                      <i className="fas fa-cloud-upload-alt text-2xl"></i>
                    </div>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">点击上传</span> 或拖拽照片</p>
                    <p className="text-xs text-gray-400">支持 JPG, PNG (最大 5MB)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <span className="bg-pink-100 text-pink-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
              定制拍摄选项
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-3">花礼类型</label>
                <div className="grid grid-cols-3 gap-2">
                  {GIFT_TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setParams({ ...params, giftType: opt.value })}
                      className={`flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl border text-center transition-all ${
                        params.giftType === opt.value
                          ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-sm font-bold'
                          : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                      }`}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <span className="text-[12px]">{opt.label}</span>
                      <span className="text-[9px] opacity-60 leading-tight">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-600">花束直径 (大小控制)</label>
                  <span className="text-pink-600 font-bold bg-pink-50 px-3 py-1 rounded-full text-xs">
                    {params.size} cm
                  </span>
                </div>
                <input 
                  type="range" 
                  min="25" 
                  max="70" 
                  step="1"
                  value={params.size}
                  onChange={(e) => setParams({ ...params, size: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-2 px-1">
                  <span>小花束 (约25cm)</span>
                  <span>中等 (45cm)</span>
                  <span>巨型 (70cm)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">背景场景</label>
                  <select 
                    value={params.scene}
                    onChange={(e) => setParams({ ...params, scene: e.target.value as any })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition"
                  >
                    {SCENE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">服装风格</label>
                  <select 
                    value={params.style}
                    onChange={(e) => setParams({ ...params, style: e.target.value as any })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition"
                  >
                    {STYLE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">合影人数 / 组合</label>
                <div className="grid grid-cols-2 gap-2">
                  {COMPOSITION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setParams({ ...params, composition: opt.value })}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        params.composition === opt.value
                          ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-sm'
                          : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                      }`}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{opt.label}</span>
                        <span className="text-[10px] opacity-70">{opt.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={!image || isGenerating}
                onClick={handleGenerate}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-pink-200 transition-all flex items-center justify-center gap-2 ${
                  !image || isGenerating 
                    ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                    : 'bg-gradient-to-r from-pink-500 to-rose-400 hover:scale-[1.02] active:scale-95'
                }`}
              >
                {isGenerating ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    AI 正在构思精修 (预计 30-60s)...
                  </>
                ) : (
                  <>
                    <i className="fas fa-wand-magic-sparkles"></i>
                    开始拍摄 (免费生成多张)
                  </>
                )}
              </button>
              {error && (
                <div className="text-rose-500 text-xs text-center font-medium bg-rose-50 p-3 rounded-lg border border-rose-100 animate-pulse">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {results.length > 0 && (
          <section className="pt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">拍摄结果</h3>
              <div className="text-xs text-pink-500 bg-pink-50 px-2 py-1 rounded">
                已生成 {results.length} 张大片
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.map((url, idx) => (
                <div key={idx} className="group relative rounded-2xl overflow-hidden shadow-lg aspect-[3/4] bg-gray-100">
                  <img 
                    src={url} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    alt={`Result ${idx + 1}`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `floral-celeb-${idx}.png`;
                        link.click();
                      }}
                      className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-pink-500 hover:text-white transition"
                    >
                      <i className="fas fa-download"></i>
                      下载高清图
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {isGenerating && results.length === 0 && (
          <section className="pt-8 space-y-6">
            <h3 className="text-xl font-bold text-gray-300 animate-pulse">正在精修大片...</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-gray-200 animate-pulse flex items-center justify-center overflow-hidden">
                  <div className="text-gray-400 flex flex-col items-center gap-2">
                    <i className="fas fa-image text-3xl"></i>
                    <span className="text-xs">处理中...</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default App;
