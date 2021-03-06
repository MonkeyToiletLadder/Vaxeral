let consts = require('constants');
let helpers = require('helpers');

module.exports = {
    spawn: function(spawn, body, target) {
        spawn = Game.spawns[spawn];
        if(_.isUndefined(spawn)) {
            return consts.ERROR_INVALID_ARGS;
        }
        target = Game.flags[target];
        if(_.isUndefined(target) || _.isUndefined(target.memory.target_id)) {
            return consts.ERROR_INVALID_ARGS;
        }
        let creep = Date.now();
        
        let is_spawned = spawn.spawnCreep(body, creep, { memory: { role: 'storer', tags: ['hauler'], is_gathering: true, target: target.name } });
        
        return is_spawned;
    },
    tick: function(storer) {
        if(storer.memory.is_gathering && storer.store.getFreeCapacity() == 0) {
            storer.memory.is_gathering = false;
        } else if(!storer.memory.is_gathering && storer.store.getFreeCapacity() == storer.store.getCapacity()) {
            storer.memory.is_gathering = true;
        }
        if(storer.memory.is_gathering) {
            let flag = Game.flags[storer.memory.target];
            let target = Game.getObjectById(flag.memory.target_id);
            let harvester = Game.creeps[flag.memory.harvester];
            if(!_.isUndefined(harvester) && harvester.memory.in_position) {
                helpers.haul(storer, RESOURCE_ENERGY);   
            } else {
                let is_harvested = storer.harvest(target);
                if(is_harvested == ERR_NOT_IN_RANGE) {
                    storer.moveTo(target);   
                }
            }
        } else {
            let stores = storer.room.find(FIND_MY_STRUCTURES, { filter: (s) => { return !_.isUndefined(s.store) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0; } })

            let store = stores[0];
            
            let is_transfered = storer.transfer(store, RESOURCE_ENERGY);
            
            if(is_transfered == ERR_NOT_IN_RANGE) {
                storer.moveTo(store);   
            }
        }
    }
}
