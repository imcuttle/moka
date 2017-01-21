/**
 * Copyright (c) Konstantin Tarkus (@koistya). All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var info = require('./util').info;
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

function push(sourceDir, remote, cb) {

    if (!path.isAbsolute(sourceDir) && process) {
        sourceDir = path.join(process.cwd(), sourceDir);
    }

    if (typeof remote === 'string') {
        remote = {name: 'origin', url: remote, branch: 'master'};
    }

    remote.branch = remote.branch || 'master';
    remote.name = remote.name || 'origin';

    cb = cb || function() {};

    var options = {cwd: sourceDir, stdio: 'inherit'};
    var message = 'Update ' + new Date().toISOString();

    // Start with an empty promise
    Promise.resolve()

    //
    // Initialize a new Git repository if it doesn't exist
    // -------------------------------------------------------------------------
        .then(function() {
            return new Promise(function(resolve, reject) {
                if (!fs.existsSync(path.join(options.cwd, '.git'))) {
                    spawn('git', ['init'], options)
                        .on('exit', function(code) {
                            if (code === 0) {
                                resolve();
                            } else {
                                reject(new Error('Failed to initialize a new Git repository.'));
                            }
                        });
                } else {
                    resolve();
                }
            });
        })

        //
        // Set a remote repository URL
        // -------------------------------------------------------------------------
        .then(function() {
            return new Promise(function(resolve) {
                exec('git config --get remote.' + remote.name + '.url', options,
                    function(err, stdout) {
                        if (stdout.trim() === '') {
                            spawn('git', ['remote', 'add', remote.name, remote.url], options)
                                .on('exit', function() {
                                    info('Add a new remote ' + remote.url + '(' + remote.name + ')');
                                    resolve();
                                });
                        } else if (stdout.trim() !== remote.url) {
                            spawn('git', ['remote', 'set-url', remote.name, remote.url], options)
                                .on('exit', function() {
                                    info('Set \'' + remote.name + '\' remote to ' + remote.url);
                                    resolve();
                                });
                        } else {
                            resolve();
                        }
                    }
                );
            });
        })

        //
        // Check if target branch exists
        // -------------------------------------------------------------------------
        .then(function() {
            return new Promise(function(resolve) {
                exec('git ls-remote ' + remote.name + ' ' + remote.branch, options,
                    function(err, stdout) {
                        if (stdout.trim() === '') {
                            spawn('git', ['add', '.'], options)
                                .on('exit', function() {
                                    spawn('git', ['commit', '-m', message], options)
                                        .on('exit', function() {
                                            spawn('git', ['push', remote.name, 'master'], options)
                                                .on('exit', function() {
                                                    cb();
                                                });
                                        });
                                });
                        } else {
                            resolve();
                        }
                    }
                );
            });
        })

        //
        // Add new/modified/deleted files to staging area
        // -------------------------------------------------------------------------
        .then(function() {
            return new Promise(function(resolve, reject) {
                info('Adding files to staging area...');
                spawn('git', ['add', '--all', '.'], options)
                    .on('exit', function(code) {
                        if (code === 0) {
                            resolve();
                        } else {
                            reject(new Error('Failed to add files.'));
                        }
                    });
            });
        })

        //
        // Create a new commit
        // -------------------------------------------------------------------------
        .then(function() {
            return new Promise(function(resolve, reject) {
                info('Creating a new commit...');
                spawn('git', ['commit', '-m', message], options)
                    .on('exit', function(code) {
                        if (code === 0) {
                            resolve();
                        } else {
                            reject(new Error('Failed to create a new commit.'));
                        }
                    });
            });
        })

        //
        // Push to remote
        // -------------------------------------------------------------------------
        .then(function() {
            return new Promise(function(resolve, reject) {
                info('Pushing to ' + remote.url);
                spawn('git', ['push', remote.name, 'master', '--force'], options)
                    .on('exit', function(code) {
                        if (code === 0) {
                            cb();
                        } else {
                            reject(new Error('Failed to push commits.'));
                        }
                    });
            });
        })

        //
        // Catch errors
        // -------------------------------------------------------------------------
        .catch(function(err) {
            cb(err || new Error('Failed to push the contents.'));
        });
}

module.exports = push;