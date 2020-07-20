/*
 * File: io.js
 * Project: porton-health-api
 * File Created: Saturday, 2nd May 2020 4:33:51 pm
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Saturday, 18th July 2020 6:43:55 pm
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */
const fs = require('fs');
const path = require('path');

/**
 * Check if a path is a directory
 *
 * @param {string} dir the directory to check
 */
const isDirectory = (dir) => {
	try {
		return fs.lstatSync(dir).isDirectory();
	} catch (error) {
		return false;
	}
};

/**
 * Check if a path is a file
 *
 * @param {string} file the directory to check
 */
const isFile = (file) => {
	try {
		return fs.lstatSync(file).isFile();
	} catch (error) {
		return false;
	}
};

/**
 * Read all the files in a directory
 * and return files names as array
 * @param {string} dir The directory
 * @param {bool} recursvive if to load subdirectories
 *
 * @return array
 */

const getFilesArray = (dir, recursvive = false) => {
	try {
		const files = [];
		fs.readdirSync(dir).forEach((file) => {
			const theFile = path.join(dir, file);
			// Make sure it is not a directory
			if (!isDirectory(theFile)) files.push(path.join(dir, file));
			else {
				if (recursvive) getFilesArray(theFile, true);
			}
		});
		return files;
	} catch (error) {
		return null;
	}
};

const isDotFile = (file) => {
	// filename
	if (!file) return false;
	const regex = /^\./;
	if (file.split('/').length === 1) return regex.test(file);
	return regex.test(file.split('/').slice(-1)[0]);
};

module.exports = {
	isFile,
	getFilesArray,
	isDirectory,
	isDotFile,
};
