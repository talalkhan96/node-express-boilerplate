'use strict';

var express = require('express');  
var Token = require('../middleware/token');
var controller = require('./cache.controller')
var router = express.Router();

// router.post('/set-state', auth.isAuthenticated(), service.setUserState)

// router.get('/get-state', auth.isAuthenticated(), service.getUserState)

router.get('/get-redis-keys', Token.isAuthenticated(), controller.getRedisKeys)

router.post('/get-redis-key', Token.isAuthenticated(), controller.getRedisKey)

router.post('/delete-redis-key', Token.isAuthenticated(), controller.deleteRedisKey)

router.post('/delete-redis-keys', Token.isAuthenticated(), controller.deleteRedisKeys)

// router.get('/search-redis-keys',  controller.searchRedisKeys)

module.exports = router;
