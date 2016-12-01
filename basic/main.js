var roleHarvester = require('role.harvester');
var HARVESTER_LIMIT = 1;
var roleBuilder = require('role.builder');
var BUILDER_LIMIT = 4;
var roleUpgrader = require('role.upgrader');
var UPGRADER_LIMIT = 3;

var lastCpuBucket;
var bucketFull;
module.exports.loop = function () {
    var bucketDiff = Game.cpu.bucket - lastCpuBucket;
    lastCpuBucket = Game.cpu.bucket;
    if (bucketDiff != 0 && !!bucketDiff) {
        if (bucketDiff > 0) {console.log('BUCKET: +' + bucketDiff.toString() + ', Total: ' + Game.cpu.bucket.toString());}
        else {console.log('BUCKET: ' + bucketDiff.toString() + ', Total: ' + Game.cpu.bucket.toString());}
    }
    else if (bucketDiff == 0 && bucketFull == false) {
        console.log('BUCKET FULL');
        bucketFull = true;
    }
    
    //for (var i in _.range(0,240000)) {
    //    Game.spawns['Spawn1'].canCreateCreep(roleBuilder.body);
    //}

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == roleHarvester.role);
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == roleBuilder.role);
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == roleUpgrader.role);
    
    if (harvesters.length < HARVESTER_LIMIT && Game.spawns['Spawn1'].canCreateCreep(roleHarvester.body) == 0) {
        var newName = Game.spawns['Spawn1'].createCreep(roleHarvester.body, undefined, {role: roleHarvester.role});
        console.log('Spawning new ' + roleHarvester.role + ': ' + newName);
    }
    else if (builders.length < BUILDER_LIMIT && Game.spawns['Spawn1'].canCreateCreep(roleBuilder.body) == 0) {
        var newName = Game.spawns['Spawn1'].createCreep(roleBuilder.body, undefined, {role: roleBuilder.role});
        console.log('Spawning new ' + roleBuilder.role + ': ' + newName);
    }
    else if (upgraders.length < UPGRADER_LIMIT && Game.spawns['Spawn1'].canCreateCreep(roleUpgrader.body) == 0) {
        var newName = Game.spawns['Spawn1'].createCreep(roleUpgrader.body, undefined, {role: roleUpgrader.role});
        console.log('Spawning new ' + roleUpgrader.role + ': ' + newName);
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == roleHarvester.role) {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == roleUpgrader.role) {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == roleBuilder.role) {
            roleBuilder.run(creep);
        }
    }
}