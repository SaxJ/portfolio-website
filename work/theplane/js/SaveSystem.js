/**
 * Represents a slot-based save system using javascript local storage.
 * @namespace Represents a 5 slot save system.
 * @author Saxon Jensen
 */
var SaveSystem = {

    /**
    * Saves an object to the specified save slot.
    * @public
    * @static
    * @param {Object} saveObject The object to save
    * @param {Number} slot The save slot number to save the object into.
    */
    save: function (saveObject, slot) {
        if (slot > 5 || slot < 1 || slot === undefined) {
            throw new Error("Must specify a save slot between 1 and 5 inclusive.");
            return false;
        }

        var objectString = JSON.stringify(saveObject);
        var key = "saveSlot-" + slot;
        localStorage.setItem(key, objectString);
    },

    /**
    * Reads an object from the save slot. If the slot does not exist, or the slot is empty, null is returned.
    * @param {Number} slot The save slot to read from.
    * @public
    * @static
    */
    read: function (slot) {
        if (slot > 5 || slot < 1 || slot === undefined) {
            throw new Error("Must specify a save slot number between 1 and 5 inclusive.");
            return null;
        }

        var key = "saveSlot-" + slot;
        var obj = localStorage.getItem(key);

        return JSON.parse(obj);
    },

    /**
    * Deletes a save slot.
    * @param {Number} slot The slot to clear data from.
    * @static
    * @public
    */
    remove: function (slot) {
        if (slot > 5 || slot < 1 || slot === undefined) {
            throw new Error("Must specify a save slot number between 1 and 5 inclusive.");
            return null;
        }

        var key = "saveSlot-" + slot;
        localStorage.removeItem(key);
    }
};