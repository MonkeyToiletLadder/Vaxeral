let helpers = require('helpers.js');
let consts = require('constants.js');

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
        
        if(_.isUndefined(target.memory.harvester)) {
            return consts.ERROR_NO_HARVESTERS;   
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
            if(!_.isUndefined(target.memory.harvester)) {
                helpers.haul(upgrader, RESOURCE_ENERGY);                
            } else {
                
            }
        } else {
            let rc = Game.rooms[upgrader.memory.room].controller;
            
            let is_transfered = upgrader.transfer(rc, RESOURCE_ENERGY);
            
            if(is_transfered == ERR_NOT_IN_RANGE) {
                upgrader.moveTo(rc);
            }
        }        
    }
}
