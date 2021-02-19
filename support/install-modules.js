/*
 * File: install-modules.js
 * Project: @expresswayjs/expressway
 * File Created: Saturday, 30th May 2020 6:46:02 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Friday, 19th February 2021 4:22:45 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2021, CamelCase Technologies Ltd
 */
require('colors');

const { exec } = require('child_process'),
    fs = require('fs'),
    path = require('path');

/**
 * Install npm dependencies
 * @param {Array} dependencies The dependencies to install
 *
 * @throws {TypeError}
 * @return {bool}    It is done
 */
const installModules = async (dependencies) => {
    if (!Array.isArray(dependencies)) {
        if (typeof dependencies === 'string') {
            dependencies = [dependencies];
        } else {
            throw new TypeError('Dependencies must be array or string');
        }
    }

    let toInstall = [...dependencies];

    try {
        // Please use require.resolve('module') later;
        const installedPackages = await new Promise((resolve, reject) => {
            let appPkgs = fs.readFileSync(
                    path.join(appRoot, '../package.json')
                ),
                expresswayPkgs = fs.readFileSync(
                    path.join(expresswayRoot, 'package.json')
                ),
                pkg = {};

            if (expresswayPkgs) {
                let parsed = JSON.parse(expresswayPkgs);
                pkg = {
                    ...pkg,
                    ...(parsed.devDependencies || {}),
                    ...(parsed.dependencies || {}),
                };
            }
            if (appPkgs) {
                let parsed = JSON.parse(appPkgs);
                pkg = {
                    ...pkg,
                    ...(parsed.devDependencies || {}),
                    ...(parsed.dependencies || {}),
                };
            }

            if (Object.keys(pkg).length) {
                resolve(pkg);
                return;
            }
            reject(
                new ReferenceError(
                    'package.json not found or no depencies installed'
                )
            );
        });

        for (var i = 0; i < dependencies.length; i++) {
            if (installedPackages[toInstall[0]]) {
                toInstall.splice(0, 1);
            }
        }
    } catch (error) {
        throw error;
    }

    if (!toInstall.length) {
        Promise.resolve(true);
        return;
    }

    console.log(`📦 Installing dependencies ${toInstall.join(',')}`.green);

    try {
        await new Promise((resolve, reject) => {
            exec(`yarn add ${toInstall.join(' ')}`, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                }

                // the *entire* stdout and stderr (buffered)
                // console.log(`stdout: ${stdout}`);
                // console.log(`stderr: ${stderr}`);

                resolve({
                    stdout,
                });
            });
        });
        console.log(`✅ Dependencies installed`.green);
        // console.log(`Restarting...`.green);

        // RESTART APPLICATION
        //CREDIT thekenyandev.com/blog/how-to-restart-a-node-js-app-programmatically/
        // setTimeout(function () {
        // 	process.on('exit', function () {
        // 		require('child_process').spawn(
        // 			process.argv.shift(),
        // 			process.argv,
        // 			{
        // 				cwd: process.cwd(),
        // 				detached: true,
        // 				stdio: 'inherit',
        // 			}
        // 		);
        // 	});
        // 	process.exit();
        // }, 1000);

        return Promise.resolve(true);
    } catch (error) {
        throw error;
    }
};
module.exports = installModules;
