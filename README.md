# Three.js 3D 产品配置器

这是一个基于 Three.js 和 Vite 开发的轻量级 3D 产品配置器。用户可以旋转和缩放模型、切换产品颜色与材质，并将当前配置导出为 PNG 图片。

> 本仓库基于 [Grantmantek/threejs-product-configurator](https://github.com/Grantmantek/threejs-product-configurator) 修改，遵循 MIT License。当前版本主要补充了中文项目说明，核心代码与功能保持不变。

## 功能

- 支持鼠标、触控板和触屏旋转及缩放
- 提供哑光、缎面、金属和高光四种材质
- 提供六种产品颜色
- 一键导出当前 3D 视图为 PNG 图片
- 使用 Three.js 内置环境光照，无需额外 HDR 文件
- 支持 `prefers-reduced-motion`，减少动态效果时自动停止旋转
- 控件支持键盘操作并包含无障碍标签

## 环境要求

- Node.js 20 或更高版本

## 本地运行

```bash
npm install
npm run dev
```

启动后，打开 Vite 输出的本地地址，通常为 `http://localhost:5173`。

## 使用方法

1. 拖动鼠标旋转产品，滚动滚轮或双指缩放。
2. 在控制面板中选择颜色和材质。
3. 点击 **Download PNG** 保存当前视图。

构建生产版本：

```bash
npm run build
npm run preview
```

## 配置说明

常用配置集中在 `src/main.ts` 顶部：

| 配置项 | 位置 | 说明 |
| --- | --- | --- |
| 产品颜色 | `COLORS` | 可添加或替换十六进制颜色值 |
| 产品材质 | `MATERIALS` | 每个配置项会创建一个新的 Three.js 材质 |
| 初始镜头 | `camera.position.set(...)` | 设置页面打开时的观察角度和距离 |
| 缩放范围 | `controls.minDistance` / `maxDistance` | 设置相机允许的最近和最远距离 |
| 自动旋转速度 | `controls.autoRotateSpeed` | 设置产品自动旋转速度 |
| 场景背景 | `scene.background` | 设置产品展示区域背景色 |

## 替换为自己的 3D 模型

可以使用 `GLTFLoader` 加载放在 `public/` 目录中的 glTF 或 GLB 模型，并替换 `src/main.ts` 中的示例几何体：

```ts
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const gltf = await new GLTFLoader().loadAsync("/model.glb");
scene.add(gltf.scene);
```

## 技术栈

- Three.js
- TypeScript
- Vite
- WebGL

## 开源许可

本项目采用 MIT License，具体内容见 [LICENSE](LICENSE)。原作者版权信息已完整保留。
