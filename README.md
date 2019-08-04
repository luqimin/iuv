## 开发说明

### 开发准备

```shell
# 下载源码
git clone

# 安装lerna
npm i -g lerna

# 安装依赖
lerna bootstrap
```

### 本地开发

```shell
npm start
```

### 发布步骤

```shell
# 编译ts
npm run build

# push代码
git add && git commit && git push origin

# 发布npm
lerna publish
```
