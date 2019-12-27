import * as path from 'path';
import * as babel from '@babel/core';
import * as presetsEnv from '@babel/preset-env';
import * as presetsReact from '@babel/preset-react';
import * as presetsTypescript from '@babel/preset-typescript';
import * as runtimePlugin from '@babel/plugin-transform-runtime';
import * as importPlugin from 'babel-plugin-import';
import * as syntaxDyamicImportPlugin from '@babel/plugin-syntax-dynamic-import';

import * as restSpreadPlugin from '@babel/plugin-proposal-object-rest-spread';
import * as decoratorsPlugin from '@babel/plugin-proposal-decorators';
import * as classPropertiesPlugin from '@babel/plugin-proposal-class-properties';
import * as regeneratorPlugin from '@babel/plugin-transform-regenerator';

import { IUVPackConfig } from '../const/config';

const babelRuntimePath = path.resolve(process.env.IUV_ROOT_PATH || process.cwd(), 'node_modules/@babel/runtime');

export interface BabelLoaderOptions extends babel.TransformOptions {
    cacheDirectory: boolean;
}

/**
 * 获取babel配置
 */
export const getBabelConfig = (context: string, isSSR: boolean, config: IUVPackConfig): BabelLoaderOptions => {
    const enableImportStyle: boolean = !isSSR;

    const presets = [
        [
            presetsEnv,
            {
                targets: {
                    node: 'current',
                    browsers: config.browsers,
                },
                modules: false,
                useBuiltIns: 'entry',
                corejs: '2',
            },
        ],
        presetsReact,
        [
            presetsTypescript,
            {
                isTSX: true,
                allExtensions: true,
            },
        ],
    ];
    const plugins = [
        [
            runtimePlugin,
            {
                absoluteRuntime: babelRuntimePath,
            },
        ],
        [
            importPlugin,
            {
                libraryName: 'antd',
                style: enableImportStyle,
            },
            'antd',
        ],
        [
            importPlugin,
            {
                libraryName: 'ant-design-pro',
                libraryDirectory: 'lib',
                style: enableImportStyle,
                camel2DashComponentName: false,
            },
            'ant-design-pro',
        ],
        [
            importPlugin,
            {
                libraryName: 'lodash',
                libraryDirectory: '',
                camel2DashComponentName: false,
            },
            'lodash',
        ],
        [decoratorsPlugin, { legacy: true }],
        [classPropertiesPlugin, { loose: true }],
        [regeneratorPlugin, { asyncGenerators: false }],
        syntaxDyamicImportPlugin,
        restSpreadPlugin,
    ];

    try {
        const LoadablePlugin = require(path.resolve(context, 'node_modules', '@loadable', 'babel-plugin'));
        plugins.unshift(LoadablePlugin.default);
    } catch (error) {}

    return { cacheDirectory: true, presets, plugins };
};
