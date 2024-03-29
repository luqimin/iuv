import * as path from 'path';

import * as importPlugin from 'babel-plugin-import';

import * as babel from '@babel/core';
import * as classPropertiesPlugin from '@babel/plugin-proposal-class-properties';
import * as decoratorsPlugin from '@babel/plugin-proposal-decorators';
import * as restSpreadPlugin from '@babel/plugin-proposal-object-rest-spread';
import * as optionalChainingPlugin from '@babel/plugin-proposal-optional-chaining';
import * as syntaxDyamicImportPlugin from '@babel/plugin-syntax-dynamic-import';
import * as regeneratorPlugin from '@babel/plugin-transform-regenerator';
import * as runtimePlugin from '@babel/plugin-transform-runtime';
import * as presetsEnv from '@babel/preset-env';
import * as presetsReact from '@babel/preset-react';
import * as presetsTypescript from '@babel/preset-typescript';

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
                useBuiltIns: 'usage',
                corejs: '3',
                shippedProposals: true,
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
                corejs: '3',
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
                libraryName: 'lodash',
                libraryDirectory: '',
                camel2DashComponentName: false,
            },
            'lodash',
        ],
        [decoratorsPlugin, { legacy: true }],
        [classPropertiesPlugin, { loose: false }],
        [regeneratorPlugin, { asyncGenerators: false }],
        syntaxDyamicImportPlugin,
        restSpreadPlugin,
        optionalChainingPlugin,
    ];

    try {
        const LoadablePlugin = require(path.resolve(context, 'node_modules', '@loadable', 'babel-plugin'));
        plugins.unshift(LoadablePlugin.default);
        // eslint-disable-next-line no-empty
    } catch (error) {}

    return { cacheDirectory: true, presets, plugins };
};
