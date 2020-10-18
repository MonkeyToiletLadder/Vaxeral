let helpers = require('helpers');
let consts = require('constants');

module.exports = {
    spawn: function(spawn, body, target, room) {
        spawn = Game.spawns[spawn];
        if(_.isUndefined(spawn)) {
            return consts.ERROR_INVALID_ARGS;
        }
        target = Game.flags[target];
        if(_.isUndefined(target)) {
            return consts.ERROR_INVALID_ARGS;   
        }
        room = Game.rooms[room];
        if(_.isUndefined(room)) {
            return consts.ERROR_INVALID_ARGS;
        }
        let creep = Date.now();
        
        let is_spawned = spawn.spawnCreep(body, creep, { memory: { role: 'upgrader', tags: ['hauler'], is_gathering: true, target: target.name, room: room.name } });
        
        return is_spawned;
    },
    tick: function(upgrader) {
        if(upgrader.memory.is_gathering && upgrader.store.getFreeCapacity() == 0) {
            upgrader.memory.is_gathering = false;
        } else if(!upgrader.memory.is_gathering && upgrader.store.getFreeCapacity() == upgrader.store.getCapacity()) {
            upgrader.memory.is_gathering = true;
        }
        if(upgrader.memory.is_gathering) {
            let flag = Game.flags[upgrader.memory.target];
            let target = Game.getObjectById(flag.memory.target_id);
            let harvester = Game.creeps[flag.memory.harvester];
            if(!_.isUndefined(harvester) && harvester.memory.in_position) {
                helpers.haul(upgrader, RESOURCE_ENERGY);                
            } else {
                let is_harvested = upgrader.harvest(target);
                if(is_harvested == ERR_NOT_IN_RANGE) {
                    upgrader.moveTo(target); 
                }
            }
        } else {
            let rc = Game.rooms[upgrader.memory.room].controller;
            console.log(rc);
            
            let is_transfered = upgrader.upgradeController(rc);
            console.log(is_transfered);
            if(is_transfered == ERR_NOT_IN_RANGE) {
                upgrader.moveTo(rc);
            }
        }        
    }
}
