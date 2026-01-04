
import React from 'react';
import { GiftType, CompositionType, AIModel } from './types';

export const MODEL_OPTIONS: { label: string; value: AIModel; icon: string; desc: string; badge?: string }[] = [
  { 
    label: '标准快拍', 
    value: 'gemini-2.5-flash-image', 
    icon: '⚡', 
    desc: '基于 Gemini 2.5，生成速度极快',
    badge: '推荐'
  },
  { 
    label: '艺术精修', 
    value: 'gemini-2.5-flash-image-artistic' as any, 
    icon: '🎨', 
    desc: '强化构图与色彩，呈现电影质感',
    badge: '免费'
  },
];

export const GIFT_TYPE_OPTIONS: { label: string; value: GiftType; icon: string; desc: string }[] = [
  { label: '经典花束', value: 'bouquet', icon: '💐', desc: '传统手持/怀抱式' },
  { label: '抱抱桶', value: 'hug_bucket', icon: '🪣', desc: '餐桌摆放/优雅合影' },
  { label: '精美礼盒', value: 'gift_box', icon: '🎁', desc: '开启惊喜时刻' },
];

export const SCENE_OPTIONS = [
  { label: '网红小咖啡店', value: 'cafe' },
  { label: '精致小甜品店', value: 'dessert_shop' },
  { label: '高级西餐厅', value: 'restaurant' },
  { label: '时尚清吧', value: 'bar' },
  { label: '中餐厅包房', value: 'chinese_vip' },
  { label: '西餐厅包房', value: 'western_vip' },
  { label: 'KTV包房', value: 'ktv_vip' },
  { label: '高档酒吧包房', value: 'bar_vip' },
  { label: '花店拍照区', value: 'flower_shop_zone' },
  { label: '家庭小汽车内', value: 'car_interior' },
  { label: '东南亚美食餐厅', value: 'southeast_asian' },
  { label: '精致融合餐厅', value: 'fusion' },
  { label: '轻奢花园', value: 'garden' },
  { label: '校园美景', value: 'school' },
  { label: '梧州骑楼城街拍', value: 'qilou' },
];

export const STYLE_OPTIONS = [
  { label: '芭蕾气质风', value: 'balletcore' },
  { label: '蝴蝶结甜心', value: 'coquette' },
  { label: '美式复古校园', value: 'varsity' },
  { label: '清冷机能少女', value: 'tech_girl' },
  { label: '南法田园风', value: 'cottagecore' },
  { label: '极简白开水风', value: 'pure_minimalist' },
  { label: '美式学院风', value: 'preppy' },
  { label: '多巴胺穿搭', value: 'dopamine' },
  { label: '森系少女感', value: 'mori_girl' },
  { label: '氛围感松弛派', value: 'relaxed' },
  { label: 'Y2K 甜酷风', value: 'y2k' },
  { label: '奶系少女感', value: 'soft_girl' },
  { label: '优雅礼服', value: 'elegant' },
  { label: '复古胶片感', value: 'vintage' },
  { label: '纯欲素人感', value: 'amateur' },
];

export const COMPOSITION_OPTIONS: { label: string; value: CompositionType; icon: string; desc: string }[] = [
  { label: '个人出镜', value: 'single', icon: '👤', desc: '精致单人写真' },
  { label: '双人闺蜜', value: 'double_bff', icon: '👭', desc: '好姐妹庆生' },
  { label: '甜蜜情侣', value: 'couple', icon: '👩‍❤️‍👨', desc: '浪漫二人世界' },
  { label: '多人闺蜜', value: 'multiple_bff', icon: '👯‍♀️', desc: '姐妹团大聚会' },
  { label: '仅拍摄花卉', value: 'none', icon: '📸', desc: '纯静物/无模特出镜' },
];
