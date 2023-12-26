'use strict';

var firebase = require('firebase')

const vrandom = require("vrandom")

var randomstring = require("randomstring")

const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

var dbConectado = false

//FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDlbxJ1KBT0F09C_WJdVkRV8RlGlPmEcPg",
  authDomain: "blighted-havoc.firebaseapp.com",
  databaseURL: "https://blighted-havoc-default-rtdb.firebaseio.com",
  projectId: "blighted-havoc",
  storageBucket: "blighted-havoc.appspot.com",
  messagingSenderId: "504242136242",
  appId: "1:504242136242:web:4537ac0b80a062a5fa15ab",
  measurementId: "G-L6K6JYRDYK"
};

firebase.initializeApp(firebaseConfig)

let database = firebase.database()


//const { putVar, getVar } = require('@gd-com/utils')
const gdCom = require('@gd-com/utils')

// version: Para evitar que se jueguen versiones antigüas
const version = "0.00.01"

// MAPAS
const maps = {
  "lostEden": {
    "lostEden0": {
        "status": "waiting",
        "healApplePos": "A",
        "hAChoose": "no",
        "acuHp": 0, // For bots to make stats near to the human players
        "acuPDef":0,
        "humanQtn": 0,
        "player1": "none",
        "player2": "none",
        "player3": "none",
        "player4": "none",
        "player5": "none",
        "player6": "none",
        "player7": "none",
        "player8": "none",
        "player9": "none",
        "player10": "none"
    },
    "lostEden1": {
        "status": "waiting",
        "healApplePos": "A",
        "hAChoose": "no",
        "acuHp": 0,
        "acuPDef":0,
        "humanQtn": 0,
        "player1": "none",
        "player2": "none",
        "player3": "none",
        "player4": "none",
        "player5": "none",
        "player6": "none",
        "player7": "none",
        "player8": "none",
        "player9": "none",
        "player10": "none"
    }/*,
    "lostEden2": {
        "status": "waiting",
        "player1": "none",
        "player2": "none",
        "player3": "none",
        "player4": "none",
        "player5": "none",
        "player6": "none",
        "player7": "none",
        "player8": "none",
        "player9": "none",
        "player10": "none"
    },
    "lostEden3": {
        "status": "waiting",
        "player1": "none",
        "player2": "none",
        "player3": "none",
        "player4": "none",
        "player5": "none",
        "player6": "none",
        "player7": "none",
        "player8": "none",
        "player9": "none",
        "player10": "none"
    },
    "lostEden4": {
        "status": "waiting",
        "player1": "none",
        "player2": "none",
        "player3": "none",
        "player4": "none",
        "player5": "none",
        "player6": "none",
        "player7": "none",
        "player8": "none",
        "player9": "none",
        "player10": "none"
    }*/}}

const SKILLCOST = {
    "StrengthenedResolve":1000,
    "MightyStrike":1000
}

wss.on('connection', async function connection(ws) {

    ws.on('close', function close() {     
        
        console.log("A user is disconnected");

        /*
        if (ws.username !== null && ws.username !== undefined) {
            //console.log("Player " + ws.username + " quit game or matching");
            // Encuentra la posición del jugador en el mapa
            const playerIndex = ws.player;
            const mapVariation = maps[ws.mapName][ws.mapVariation];
            if (mapVariation[playerIndex]) {
                // Si el jugador está en el mapa, cambia su valor a "none"
                mapVariation[playerIndex] = "none";
                console.log("Removed player " + ws.username + " from map");
                //console.log(maps[ws.mapName][ws.mapVariation])

            }
        } else {
            console.log("A user is disconnected");
        } */

    })

    ws.on('message', async function incoming(message) {
        let rec = new Buffer.from(message)
        let decoded = gdCom.getVar(rec)
        rec = JSON.parse(decoded.value)
        //console.log(rec)

        if (rec.men == 'cv'){ // cv = check version, we check if version is correct
            let data = {}
            data.men = "cv" // t is type
            data.v = version
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        } else if (rec.men == 'tu'){ //tu: try user to avoid duplications
            let data = {}

            agregarUsuario(rec.username, rec.password, rec.email)
                .then((resultado) => {
                    //console.log(resultado);
                    if (resultado.mensaje == 'userExists'){
                        data.men = "userExists"
                    } else if (resultado.mensaje == 'regSuccess'){
                        data.men = "regSuccess" 
                    } else if (resultado.mensaje == 'dbError'){
                        data.men = "dbError" 
                    }
                    data = JSON.stringify(data)
                    data = gdCom.putVar(data)
                    ws.send(data)
                })
                .catch((err) => {
                    console.error('Error: ', err);
                });

        } else if (rec.men == 'tl'){ //try login
            let data = {}

            verificarUsuario(rec.username, rec.password)
                .then((resultado) => {
                    if (resultado.mensaje == 'noExists'){
                        data.men = "noExists"
                    } else if (resultado.mensaje == 'invalidPassword'){
                        data.men = "invalidPassword" 
                    } else if (resultado.mensaje == 'dbError'){
                        data.men = "dbError" 
                    } else if (resultado.mensaje == 'success'){
                        data.men = "success"
                    }
                    data = JSON.stringify(data)
                    data = gdCom.putVar(data)
                    ws.send(data)
                })
                .catch((err) => {
                    console.error('Error: ', err);
                });

        } else if (rec.men == 'getUserData'){
            let data = {};

            // Aquí debes realizar la consulta a la base de datos para obtener la información del usuario
            try {
                const snapshot = await database.ref("users").child(rec.username).once("value");
                data = snapshot.val();
            } catch (err) {
                // Si ocurre un error en la base de datos, devuelve un mensaje de error al cliente
                console.error('Error en la base de datos: ', err);
                data = { mensaje: 'dbError', error: 'Error en la base de datos' };
                return;
            }

            // Enviar la información del usuario al cliente a través del WebSocket
            data.men = "userDataGotten"
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        } else if (rec.men == 'getPrizes'){

            try {
                // Convertir la cantidad de oro de cadena a entero
                const goldToAdd = parseInt(rec.gold, 10);

                // Actualizar la cantidad de oro en la base de datos
                await database.ref("users").child(rec.username).child("gold").transaction((currentGold) => {
                    return (currentGold || 0) + goldToAdd;
                });

            } catch (err) {
                console.error('Error en la base de datos: ', err);
                return { mensaje: 'dbError', error: 'Error en la base de datos' };
            }

        } else if (rec.men == 'matching'){ //matching players
            ws.username = rec.username

            let data = {}

            data.men = "matchingResult"

            const matchingResult = await findAvailableSpace(ws.username, rec.map, parseInt(rec.maxhp), parseInt(rec.pDef), rec.weaponName, rec.weaponCat, rec.armorName, rec.armorGrade)
            if (matchingResult.success){
                data.result = "success"
                data.mapVariation = matchingResult.variation
                data.player = matchingResult.player
                ws.mapName = matchingResult.map
                ws.mapVariation = matchingResult.variation
                ws.player = matchingResult.player
                console.log(data)
                //console.log(maps[matchingResult.map][matchingResult.variation])
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)

            } else {
                data.result = "fail"
                console.log("Matching fail")
                console.log(matchingResult.message)
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
            }  


        } else if (rec.men == 'unmatch') { //delete player from map
            console.log("Making unmatch")
            if (!ws.mapName || !ws.mapVariation) {
                return;
              }


            const playerIndex = ws.player;
            const mapVariation = maps[ws.mapName][ws.mapVariation];
            if (mapVariation[playerIndex]) {
                // Si el jugador está en el mapa, cambia su valor a "none"
                mapVariation[playerIndex] = "none";
                console.log("Removed player " + ws.username + " from map");
                console.log(maps[ws.mapName][ws.mapVariation])
                let data = {}
                data.men = "unmatched"
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
            }

        } else if (rec.men == 'unmatchGame') { //delete player from map in game
            console.log("Unmatching in game")
            const playerIndex = rec.player;
            const mapVariation = maps[rec.map][rec.variation];
            if (mapVariation[playerIndex]) {
                // Si el jugador está en el mapa, cambia su valor a "none"
                mapVariation[playerIndex] = "none";
                console.log("Removed player " + ws.username + " from map in playing game");
                console.log(maps[rec.map][rec.variation])
                let data = {}
                data.men = "unmatched"
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
            }


        } else if (rec.men == 'getMapInfo') { //We send players number and others to client
            const playerCount = await checkIfPlayersAreFull(ws.mapName, ws.mapVariation)
            let data = {}
            data.men = "mapInfo"
            data.status = maps[ws.mapName][ws.mapVariation].status
            data.playerCount = playerCount
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)


        } else if (rec.men == 'getCurrentGame') { //We send current map (match) info
            
            let mapData = maps[rec.Map][rec.mapVariation];
            let data = {
                map: {
                    status: mapData.status,
                    limitTime: mapData.limitTime,
                    ha: mapData.healApplePos
                },
                players: {}
            };

            

            for (let i = 1; i <= 10; i++) {
                let playerName = "player" + i;
                let playerData = mapData[playerName];
                if (playerData != "none"){
                    if (playerData.username.startsWith("gamebot")) {
                        let simpleArmors = ["sageMetalCopper","rollMetalTunic"] //For bots
                        let armorIndex = Math.floor(Math.random() * simpleArmors.length);
                        let selectedArmor = simpleArmors[armorIndex]

                        data.players[playerName] = {
                            type: "bot",
                            username: playerData.username,
                            hp: playerData.hp,
                            pDef: playerData.pDef,
                            posX: playerData.posx,
                            posY: playerData.posy,
                            wCat: "Sw",
                            wName: "basicStick",
                            aGrade: "Simple",
                            aName: selectedArmor
                        };
                    } else {
                        data.players[playerName] = {
                            type: "human",
                            username: playerData.username,
                            master: playerData.master,
                            hp: playerData.hp,
                            pDef: playerData.physDe,
                            posX: playerData.posx,
                            posY: playerData.posy,
                            wCat: playerData.weaponCat,
                            wName: playerData.weaponName,
                            aGrade: playerData.armorGrade,
                            aName: playerData.armorName
                        };
                    }
                }                
            }

            data.men = "gameGotten"

            //console.log("Este es el juego que se le enviara al cliente")
            //console.log(data)

            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)



        } else if (rec.men == 'updatePos') { //We send players number and others to client

            const map = maps[rec.map];
            if (!map) {
            console.log("Map not found");
            return;
            }
            const variationData = map[rec.variation];
            if (!variationData) {
            console.log("Variation not found");
            return;
            }

            if (maps[rec.map][rec.variation][rec.player] == "none"){
                return;
            }

            maps[rec.map][rec.variation][rec.player].posx = rec.x
            maps[rec.map][rec.variation][rec.player].posy = rec.y

        } else if (rec.men == 'attack') { //We attack enemies

            const map = maps[rec.map];
            if (!map) {
            console.log("Map not found");
            return;
            }
            const variationData = map[rec.variation];
            if (!variationData) {
                console.log("Variation not found");
                return;
            }

            if (maps[rec.map][rec.variation][rec.enemy] == "none"){
                return;
            }

            //Send attack info for text damage animation, separate of gamegotten
            let data = {}
            data.men = "dmgAnim"
            data.enemy = rec.enemy
            data.dmgGot = rec.atk
            data.crit = rec.critical
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)



            maps[rec.map][rec.variation][rec.enemy].hp -= rec.atk

        } else if (rec.men == 'recDmg') { //We recieve damage from bots

            const map = maps[rec.map];
            if (!map) {
            console.log("Map not found");
            return;
            }
            const variationData = map[rec.variation];
            if (!variationData) {
            console.log("Variation not found");
            return;
            }
            if (maps[rec.map][rec.variation][rec.me] != 'none'){
                maps[rec.map][rec.variation][rec.me].hp -= rec.atk
            }

            //Send attack info for text damage animation, separate of gamegotten
            let data = {}
            data.men = "dmgAnimSelf"
            data.dmgGot = rec.atk
            data.crit = rec.critical
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)
            

        } else if (rec.men == 'botAttack') { //Bot attacks bot

            const map = maps[rec.map];
            if (!map) {
            console.log("Map not found");
            return;
            }
            const variationData = map[rec.variation];
            if (!variationData) {
            console.log("Variation not found");
            return;
            }

            if (maps[rec.map][rec.variation][rec.enemy] != "none"){
                maps[rec.map][rec.variation][rec.enemy].hp -= rec.dmg
            }           
            
        } else if (rec.men == 'appleHealing') { //Apple heals 50 hp in Lost Eden or fraction, depends on maxhp

            const map = maps[rec.map];
            if (!map) {
            console.log("Map not found");
            return;
            }
            const variationData = map[rec.variation];
            if (!variationData) {
            console.log("Variation not found");
            return;
            }

            if (maps[rec.map][rec.variation][rec.player] != "none"){
                maps[rec.map][rec.variation][rec.player].hp += 50

                if (maps[rec.map][rec.variation][rec.player].hp > maps[rec.map][rec.variation][rec.player].maxhp){
                    maps[rec.map][rec.variation][rec.player].hp = maps[rec.map][rec.variation][rec.player].maxhp
                }
            }           
            
        } else if (rec.men == 'saveWS'){

            const map = maps[rec.map];
            if (!map) {
            console.log("Map not found");
            return;
            }
            const variationData = map[rec.variation];
            if (!variationData) {
                console.log("Variation not found");
                return;
            }

            maps[rec.map][rec.variation][rec.player]["ws"] = ws;
            console.log("SE creo el ws:")
            console.log(maps[rec.map][rec.variation][rec.player])

        } else if (rec.men == 'skillSent'){
            console.log('Llego el skillSent')
            
            for (let player in maps[rec.map][rec.variation]){
                if (player == "status" || player == "limitTime" ||
                player == "healApplePos" || player == "hAChoose" ||
                player == "acuHp" || player == "humanQtn" ||
                player == "acuPDef"){ continue; }
                if (maps[rec.map][rec.variation][player].hasOwnProperty("ws")){

                    console.log("Activando skill")
                    let data = {}
                    data.men = "skillActivated"
                    data.skillName = rec.skillName
                    data.player = rec.player
                    data = JSON.stringify(data)
                    data = gdCom.putVar(data)
                    maps[rec.map][rec.variation][player].ws.send(data)
                    console.log(player.ws)
                }
                
            }         
        } else if (rec.men == 'buySkill'){//Skill Shop----------------------------------------------------

            let processBuy = false

            const username = rec.user;
            let price = SKILLCOST[rec.skill]
            let userGold = 0
            

            const skillPrice = parseInt(price, 10); // Precio de la habilidad a comprar
            let data = {}
            data.men = "resBuySkill"

            let canBuy = await tryGold(price, rec.user);

            if (canBuy.Status == "no"){
                data.buyStatus = "noGold"
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
                return
            } else {
                userGold = canBuy.userGold
                processBuy = true
            }

            if (processBuy){
                console.log("We can process buy")
                try {
                    // Verificar espacio disponible en actSkills
                    const snapshotSkills = await database.ref("users").child(username).child("character").child("purSkills").once("value");
                    const skillsGotten = snapshotSkills.val();
    
                    // Obtener los números de los índices de las habilidades (s1, s2, s3, etc.)
                    const skillIndexes = Object.keys(skillsGotten).map(skillName => parseInt(skillName.substring(1)));
    
                    // Ordenar los números de los índices numéricamente
                    skillIndexes.sort((a, b) => a - b);
    
                    // Crear un nuevo objeto de habilidades ordenadas
                    const orderedSkills = {};
                    for (const index of skillIndexes) {
                        const skillName = `s${index}`;
                        orderedSkills[skillName] = skillsGotten[skillName];
                    }
    
                    let purchasedSkillSlot = null;
    
                    // Buscar un espacio vacío en purSkills
                    for (const skillSlot in orderedSkills) {
                        if (orderedSkills[skillSlot].t === "n") {
                            purchasedSkillSlot = skillSlot;
                            break;
                        }
                    }
    
                    if (purchasedSkillSlot) {
                        // Actualizar la habilidad comprada en el espacio disponible
                        const updates = {};
                        updates[`users/${username}/gold`] = userGold - skillPrice;
                        updates[`users/${username}/character/purSkills/${purchasedSkillSlot}`] = {
                            t: rec.skill, // Cambiar al tipo de habilidad correcto
                            l: 1,
                            wea: rec.weapon, // Cambiar al arma correcta
                            k: rec.kind,
                            Bp: parseInt(rec.basePrice)
                        };
    
                        // Realizar las actualizaciones en la base de datos
                        await database.ref().update(updates);
    
                        // Envía una respuesta al cliente indicando la compra exitosa
                        data.buyStatus = "success"
                    } else {
                        data.buyStatus = "noSpace"
                    }
                    
                    console.log("Processing buy")
                    data = JSON.stringify(data)
                    data = gdCom.putVar(data)
                    ws.send(data)
    
                } catch (err) {
                    // Manejo de errores en la base de datos
                    console.error('Error en la base de datos: ', err);
                    // Envía una respuesta al cliente indicando el error
                }
            }        

            
        } else if (rec.men == 'updateSkillSlot'){ //We put skills in the right slots
            const username = rec.user;
            const skillFrom = rec.skillFrom;
            const skillTo = rec.skillTo;
            const kind = rec.kind; // 'a' for active, 'p' for passive
        
            // Obtener la información de la habilidad desde "purSkills"
            const snapshot = await database.ref("users").child(username).child("character").child("purSkills").child(skillFrom).once("value");
            const skillData = snapshot.val();

            
            let skillresult = await database.ref("users").child(username).child("character").child(kind === 'a' ? "actSkills" : "pasSkills").once("value");

            let skillList = skillresult.val();
            
            for (let skill in skillList) {
                if (skillList[skill].t == skillData.t){
                    let resetSkill = { t: "n"};
                    await database.ref("users").child(username).child("character").child(kind === 'a' ? "actSkills" : "pasSkills").child(skill).set(resetSkill);
                    break;
                }
            }

            // Colocar la habilidad en el slot de destino
            const skillInfo = { t: skillData.t };
            await database.ref("users").child(username).child("character").child(kind === 'a' ? "actSkills" : "pasSkills").child(skillTo).set(skillInfo);

            let data = {}
            data.men = "slotUpdated"
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        } else if (rec.men == "upgradeSkill"){ // We upgrade skills
            let processBuy = false

            const username = rec.user;
            let basePrice = SKILLCOST[rec.skill];
            let level = await database.ref("users").child(username).child("character").child("purSkills").child(rec.slot).child("l").once("value");
            level = level.val()
            let price = (level + 1) * basePrice
            let userGold = 0
        

            const skillPrice = parseInt(price, 10); // Price of skill to upgrade
            let data = {}
            data.men = "resUpgradeSkill"

            console.log(level)


            if (level > 9){
                data.upgStatus = "maxLevel"
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
                return
            }

            let canBuy = await tryGold(price, rec.user);

            if (canBuy.Status == "no"){
                data.upgStatus = "noGold"
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
                return
            } else {
                userGold = canBuy.userGold
                processBuy = true
            }

            if (processBuy){
                try {
                    // Upgrade skill
                    const updates = {};
                    updates[`users/${username}/gold`] = userGold - skillPrice;
                    updates[`users/${username}/character/purSkills/${rec.slot}/l`] = level + 1; // Increment the level by 1

                    // Realizar las actualizaciones en la base de datos
                    await database.ref().update(updates);

                    // Envía una respuesta al cliente indicando la compra exitosa
                    data.upgStatus = "success"

                    data = JSON.stringify(data)
                    data = gdCom.putVar(data)
                    ws.send(data)
    
                } catch (err) {
                    // Manejo de errores en la base de datos
                    console.error('Error en la base de datos: ', err);
                    // Envía una respuesta al cliente indicando el error
                }
            }     

        } else if (rec.men == "sellSkill"){ // We sell our skill
            let data = {};
            data.men = "resSellSkill"

            try {
                let userGold = await database.ref("users").child(rec.user).child("gold").once("value");
                userGold = userGold.val();

                let basePrice = await database.ref("users").child(rec.user).child("character").child("purSkills").child(rec.slot).child("Bp").once("value");
                basePrice = basePrice.val();

                let level = await database.ref("users").child(rec.user).child("character").child("purSkills").child(rec.slot).child("l").once("value");
                level = level.val();

                let skillName = await database.ref("users").child(rec.user).child("character").child("purSkills").child(rec.slot).child("t").once("value");
                skillName = skillName.val()


                let priceToAdd = level * basePrice

                const updates = {};
                updates[`users/${rec.user}/gold`] = userGold + priceToAdd;
                updates[`users/${rec.user}/character/purSkills/${rec.slot}`] = {
                    t: "n", 
                    l: 0,
                    wea: "All", 
                    k: "a",
                    Bp: 0
                };

                // Realizar las actualizaciones en la base de datos
                await database.ref().update(updates);

                let skillList = await database.ref("users").child(rec.user).child("character").child(rec.kind === 'a' ? "actSkills" : "pasSkills").once("value");
                skillList = skillList.val();

                for (const skillSlot in skillList) {
                    console.log(skillList[skillSlot].t)
                    console.log(skillName)

                    if (skillList[skillSlot].t === skillName) {
                        
                        console.log("Eliminando habilidad acceso directo")
                        await database.ref("users").child(rec.user).child("character").child(rec.kind === 'a' ? "actSkills" : "pasSkills").child(skillSlot).set({ t: "n"});
                        break;
                    }
                }

                data.sellStatus = "success"
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)


            } catch(err) {
                console.error('Error en la base de datos al vender: ', err);
            }

        // End skillshop---------------------------------------------------------------------- 

        } else if (rec.men == "upgWeapon") { // Weapon---------------------------------------------------------------------

            let data = {}
            data.men = "resUpgradeWeapon"

            let userGold = 0

            let basePrice = await database.ref("users").child(rec.user).child("bags").child("weaponBag").child(rec.sw).child("Bp").once("value");
            basePrice = basePrice.val();

            let evoOrbs = await database.ref("users").child(rec.user).child("bags").child("weaponBag").child(rec.sw).child("evoP").once("value");
            evoOrbs = evoOrbs.val();

            let level = await database.ref("users").child(rec.user).child("bags").child("weaponBag").child(rec.sw).child("l").once("value");
            level = level.val();

            let grade = await database.ref("users").child(rec.user).child("bags").child("weaponBag").child(rec.sw).child("g").once("value");
            grade = grade.val();

            let items = await database.ref("users").child(rec.user).child("bags").child("itemBag").once("value");
            items = items.val();

            let evoOrbName = ""
            let evoOrbQtn = 0
            let orbSlot = ""

            if (grade == "s"){
                evoOrbName = "simpleEvoOrb"
            }

            for (let item in items){
                if (items[item].gro !== "evo"){
                    continue
                } else {
                    if (items[item].na == evoOrbName){
                        evoOrbQtn = items[item].qtn
                        orbSlot = item
                        break
                    }
                }
            }
            
            let evoNeeded = level * evoOrbs

            if (evoOrbQtn == 0 || evoNeeded > evoOrbQtn){
                data.upgStatus = "noOrbs"
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
                return
            }

            console.log("Getting gold info...")
            let upgPrice = basePrice * level;

            let orb = "none"



            let processBuy = false
            let canBuy = await tryGold(upgPrice, rec.user);

            if (canBuy.Status == "no"){
                data.upgStatus = "noGold"
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
                return
            } else {
                userGold = canBuy.userGold
                processBuy = true
            }

            if (level > 29){
                data.upgStatus = "maxLevel"
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
                return
            }

            console.log("Processing...")
            // Success rate
            if (processBuy){
                let randomSuccess = Math.random(); //between 0 - 1

                let successFactor = 100 - (level - 1);

                if (randomSuccess > successFactor / 100) {
                    data.upgStatus = "fail"

                    // Downgrade weapon
                    const updates = {};
                    updates[`users/${rec.user}/gold`] = userGold - upgPrice;

                    updates[`users/${rec.user}/bags/itemBag/${orbSlot}/qtn`] = evoOrbQtn - evoNeeded;

                    let newLevel = level - 2
                    if (newLevel < 1){
                        newLevel = 1
                    }
                    updates[`users/${rec.user}/bags/weaponBag/${rec.sw}/l`] = newLevel; // Decrease the level by 2

                    // Update Db
                    await database.ref().update(updates);

                    data = JSON.stringify(data)
                    data = gdCom.putVar(data)
                    ws.send(data)

                    return
                }
            }

            if (processBuy){
                try {
                    // Upgrade weapon
                    const updates = {};
                    updates[`users/${rec.user}/gold`] = userGold - upgPrice;
                    updates[`users/${rec.user}/bags/weaponBag/${rec.sw}/l`] = level + 1; // Increment the level by 1
                    updates[`users/${rec.user}/bags/itemBag/${orbSlot}/qtn`] = evoOrbQtn - evoNeeded;

                    // Realizar las actualizaciones en la base de datos
                    await database.ref().update(updates);

                    // Envía una respuesta al cliente indicando la compra exitosa
                    data.upgStatus = "success"

                    data = JSON.stringify(data)
                    data = gdCom.putVar(data)
                    ws.send(data)
    
                } catch (err) {
                    // Manejo de errores en la base de datos
                    console.error('Error en la base de datos: ', err);
                    // Envía una respuesta al cliente indicando el error
                }
            }  

        } else if (rec.men == "equipWeapon") { 

            const username = rec.user;
            const weaponSlot = rec.slot;
        
            // Get all weapons bag
            const snapshot = await database.ref("users").child(username).child("bags").child("weaponBag").once("value");
            const weaponData = snapshot.val();

            try {
                for (let weapon in weaponData){
                    await database.ref("users").child(username).child("bags").child("weaponBag").child(weapon).child("est").set("n")
                }
            } catch (error) {
                console.error(error)
            }



            //change estate of selected weapon to equipped
            await database.ref("users").child(username).child("bags").child("weaponBag").child(weaponSlot).child("est").set("e")
            

            let data = {}
            data.men = "weaponEquipped"
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        } else if (rec.men == "sellWeapon") { 
            const username = rec.user;
            const weaponSlot = rec.sw;

            const slevel = await database.ref("users").child(username).child("bags").child("weaponBag").child(weaponSlot).child("l").once("value");
            const level = slevel.val();

            const sbp = await database.ref("users").child(username).child("bags").child("weaponBag").child(weaponSlot).child("Bp").once("value");
            const bp = sbp.val();

            const sgold = await database.ref("users").child(username).child("gold").once("value");
            const gold = sgold.val();

            const sellPrice = Math.round((bp * level)/2)
            

            //Add gold
            await database.ref("users").child(username).child("gold").set(gold + sellPrice)

            //Removing weapon
            await database.ref("users").child(username).child("bags").child("weaponBag").child(weaponSlot).set({cat:"n",t:"n",l:1,s:"n",est:"n",bo:"n"});

            let data = {}
            data.men = "weaponSold"
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        
        //END WEAPON--------------------------------------------------------------------------------------------------------

        //ARMORS------------------------------------------------------------------------------------------------------------
        }else if (rec.men == "equipArmor") { 

            const username = rec.user;
            const armorSlot = rec.slot;
        
            // Get all weapons bag
            const snapshot = await database.ref("users").child(username).child("bags").child("armorBag").once("value");
            const armorData = snapshot.val();

            try {
                for (let armor in armorData){
                    await database.ref("users").child(username).child("bags").child("armorBag").child(armor).child("est").set("n")
                }
            } catch (error) {
                console.error(error)
            }



            //change estate of selected weapon to equipped
            await database.ref("users").child(username).child("bags").child("armorBag").child(armorSlot).child("est").set("e")
            

            let data = {}
            data.men = "armorEquipped"
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        }
    })
})

// To know if we have enough gold
async function tryGold(cost, user){
    let buyPrice = parseInt(cost, 10);

    try {
        const snapshot = await database.ref("users").child(user).child("gold").once("value");
        const userGold = snapshot.val();
        if (userGold >= buyPrice) { 
            return {"Status":"yes", "userGold":userGold} 
        } else { 
            return {"Status":"no"} 
        }

    } catch (err) {
        // Manejo de errores en la base de datos
        console.error('Error en la base de datos: ', err);
        // Envía una respuesta al cliente indicando el error
    }
}

// función asincrónica para verificar y agregar un usuario a la base de datos
async function agregarUsuario(username, password, email) {
    try {
        // Verificar si el usuario ya existe en la base de datos
        const snapshot = await database.ref("users").child(username).once("value");
        if (snapshot.exists()) {
            // Si ya existe el usuario, devuelve un mensaje de error al cliente
            return { mensaje: 'userExists', error: 'El usuario ya existe en la base de datos' };
        } else {
            // Si no existe, agregar el nuevo usuario a la base de datos
            await database.ref("users").child(username).set({
                username: username,
                password: password,
                mail: email,
                gold:1000,
                diamond:0,
                character: {
                    costume:"n",
                    soulHeart:"n",
                    actSkills: {
                        s1: {t:"StrengthenedResolve"},
                        s2: {t:"n"},
                        s3: {t:"n"},
                        s4: {t:"n"},
                        s5: {t:"n"},
                        s6: {t:"n"}
                    },
                    pasSkills: {
                        s1: {t:"n"},
                        s2: {t:"n"},
                        s3: {t:"n"},
                        s4: {t:"n"},
                        s5: {t:"n"},
                        s6: {t:"n"}
                    },
                    purSkills: {
                        s1: {t:"StrengthenedResolve",l:1, wea:"Sw","Bp":1000,k:"a"}, //k is kind active or passive
                        s2: {t:"n",l:0, wea:"All","Bp":0,k:"a"},
                        s3: {t:"n",l:0, wea:"All","Bp":0,k:"a"},
                        s4: {t:"n",l:0, wea:"All","Bp":0,k:"a"},
                        s5: {t:"n",l:0, wea:"All","Bp":0,k:"a"},
                        s6: {t:"n",l:0, wea:"All","Bp":0,k:"a"},
                        s7: {t:"n",l:0, wea:"All","Bp":0,k:"a"},
                        s8: {t:"n",l:0, wea:"All","Bp":0,k:"a"},
                        s9: {t:"n",l:0, wea:"All","Bp":0,k:"a"},
                        s10: {t:"n",l:0, wea:"All","Bp":0,k:"a"},
                        s11: {t:"n",l:0, wea:"All","Bp":0,k:"a"},
                        s12: {t:"n",l:0, wea:"All","Bp":0,k:"a"}
                    }

                },
                bags: {
                    itemBag: {
                        i01:{gro:"evo",qtn:100,na:"simpleEvoOrb",pri:100,bo:"n"}, //gro:group, qtn:quantity, na:name, pri:price, bo:bound
                        i02:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"}
                    },
                    weaponBag: {
                        i01:{cat:"Sw",t:"basicStick",l:1,g:"s", se1:"n", se2:"n", se3:"n",Bp:50, evoP: 10, est:"e",bo:"n"}, //bo is bound
                        i02:{cat:"Sw",t:"basicSword",l:1,g:"s", se1:"n", se2:"n", se3:"n",Bp:75, evoP: 15, est:"n",bo:"n"},
                        i03:{cat:"n",t:"n",l:1,s:"n",est:"n",bo:"n"},
                        i04:{cat:"n",t:"n",l:1,s:"n",est:"n",bo:"n"},
                        i05:{cat:"n",t:"n",l:1,s:"n",est:"n",bo:"n"},
                        i06:{cat:"n",t:"n",l:1,s:"n",est:"n",bo:"n"}
                    },
                    armorBag: {
                        i01:{t:"sageMetalCopper",l:1,g:"s",se1:"n",se2:"n",s3:"n",Bp:50, evoP: 10, est:"e",bo:"n"},
                        i02:{t:"rollMetalTunic",l:1,g:"s",se1:"n",se2:"n",s3:"n",Bp:100, evoP: 15, est:"n",bo:"n"},
                        i03:{t:"n", est:"n"},
                        i04:{t:"n", est:"n"},
                        i05:{t:"n", est:"n"},
                        i06:{t:"n", est:"n"},
                        i07:{t:"n", est:"n"},
                        i08:{t:"n", est:"n"},
                        i09:{t:"n", est:"n"},
                        i10:{t:"n", est:"n"},
                        i11:{t:"n", est:"n"},
                        i12:{t:"n", est:"n"}
                    }
                },
                avatars: {
                    main: "voidBorneBasic",
                    av1: "voidBorneBasic",
                    av2: "n",
                    av3: "n",
                    av4: "n",
                    av5: "n"
                }
            });
            // Devolver un mensaje de éxito al cliente
            return { mensaje: 'regSuccess', data: 'Usuario agregado correctamente' };
        }
    } catch (err) {
        // Si ocurre un error en la base de datos, devuelve un mensaje de error al cliente
        console.error('Error en la base de datos: ', err);
        return { mensaje: 'dbError', error: 'Error en la base de datos' };
    }
}


  // Para el login
async function verificarUsuario(username, password) {
    try {
      // Obtener la referencia al nodo "users"
      const usersRef = database.ref('users');
  
      // Consultar la base de datos para obtener el usuario con el username dado
      const snapshot = await usersRef.orderByChild('username').equalTo(username).once('value');
      const user = snapshot.val();
  
      if (!user) {
        return { mensaje: 'noExists' };
      } else {
        // Obtenemos el primer usuario del resultado de la consulta (debería ser único)
        const userId = Object.keys(user)[0];
        const userData = user[userId];

        //console.log(userData)
  
        if (userData.password !== password) {
          return { mensaje: 'invalidPassword' };
        } else {
          return { mensaje: 'success' };
        }
      }
    } catch (error) {
      console.log('Error en la base de datos: ', error);
      return { mensaje: 'dbError', error: 'Error en la base de datos' };
    }
  }
  
  
//Look for empty spaces in maps
async function findAvailableSpace(usernamec, mapName, maxHp, pDef, wname, wcat, aname, agrade) {
    const map = maps[mapName];
    if (!map) {
        return { success: false, message: "Map not found" };
    }
    for (let variation in map) {
        const players = map[variation];
        const status = players["status"];
        console.log("Estamos en: ")
        console.log(variation)
        if (status === "playing") { //Era: status && status === "playing"
            console.log("El juego está en playing, pasamos al siguiente")
            continue; // Si la variación está en juego, pasar a la siguiente
        } else {
            for (let player in players) {
                if (player === "status") {
                    continue; // Saltar la clave "status"
                }
                if (players[player] === "none") {
                    // Creamos a nuestro jugador, acá se pondrán en un futuro todas las mejoras
                    let posX = 0
                    let posY = 0

                    // Mapa multijugador LOST EDEN
                    if (mapName == "lostEden"){
                        const mapSize = 10240
                        if (player === "player1"){
                            posX = mapSize - 450
                            posY = 1200
                        } else if (player === "player2"){
                            posX = mapSize / 3 * 2
                            posY = 1200
                        } else if (player === "player3"){
                            posX = mapSize / 3
                            posY = 1200
                        } else if (player === "player4"){
                            posX = 450
                            posY = 1200
                        } else if (player === "player5"){
                            posX = mapSize / 2 - 2000
                            posY = mapSize / 2
                        } else if (player === "player6"){
                            posX = mapSize / 2 + 2000
                            posY = mapSize / 2
                        } else if (player === "player7"){
                            posX = 450
                            posY = mapSize - 450
                        } else if (player === "player8"){
                            posX = mapSize / 3
                            posY = mapSize - 450
                        } else if (player === "player9"){
                            posX = mapSize / 3 * 2
                            posY = mapSize - 450
                        } else if (player === "player10"){
                            posX = mapSize - 450
                            posY = mapSize - 450
                        }
                    }


                    
                    players[player] = { 
                        username:usernamec,
                        master:"no",
                        maxhp: maxHp,
                        hp: maxHp,
                        physDe: pDef,
                        posx: posX,
                        posy: posY,
                        status: "I",
                        weaponName:wname,
                        weaponCat:wcat,
                        armorName:aname,
                        armorGrade:agrade
                    };

                    players["acuHp"] += maxHp
                    players["acuPDef"] += pDef
                    players["humanQtn"] += 1
                    
                    players["status"] = "waiting"; // Actualizar el estado de la variación
                    console.log("Jugador creado en: ")
                    console.log(variation)
                    console.log(maps[mapName][variation])

                    //LOST EDEN ONLY
                    if (mapName == "lostEden"){
                        if (maps[mapName][variation].hAChoose == "no"){

                            let appleArray = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
                            if (appleArray == 1){
                                maps[mapName][variation].healApplePos = "A"
                            } else if (appleArray == 2){
                                maps[mapName][variation].healApplePos = "B"
                            } else if (appleArray == 3){
                                maps[mapName][variation].healApplePos = "C"
                            } else if (appleArray == 4){
                                maps[mapName][variation].healApplePos = "D"
                            } else if (appleArray == 5){
                                maps[mapName][variation].healApplePos = "E"
                            }

                        maps[mapName][variation].hAChoose = "yes"
                        console.log("Se eligió como heal apple array: " + maps[mapName][variation].healApplePos)
        
                    }
            }

                    return { success: true, map: mapName, variation, player };
                }
            }

        }
    }
    return { success: false, message: "No available space found" };
}
  
//Check how many players
function checkIfPlayersAreFull(mapName, variation) {
    const map = maps[mapName];
    if (!map) {
      console.log("Map not found");
      return false;
    }
    const variationData = map[variation];
    if (!variationData) {
      console.log("Variation not found");
      return false;
    }
    
    let playerCount = 0;
    
    for (let i = 1; i <= 10; i++) {
      if (variationData["player" + i] != "none") {
        playerCount++;
      }
    }
    
    return playerCount;
}
  
//Add bots
function isGameFull(game) {
    const playerCount = Object.values(game).filter(val => typeof val === "object" && val.username !== undefined && val.username !== "gamebot").length;
    return playerCount === 10;
  }

var countBots = 0 //Para contar el tiempo, cada 3 segundos se agrega un bot
function addBotsToWaitingGames() {
    countBots += 1

    for (let mapName in maps) {
      for (let variation in maps[mapName]) {
        let game = maps[mapName][variation];     
        
        if (game.status === "playing" || game.status === "finishing") {
            console.log(`Juego en curso en ${variation}`);
            //console.log(game);

            // Verificamos que la partida expiró
            let limitTime = game.limitTime;
            let realLimitTime = limitTime - 5; // antes de los 5 segundos de acabar la partida botamos a los jugadores

            let currentTime = Math.floor(Date.now() / 1000);

            //console.log("Tiempo de creacion: " + realLimitTime.toString())
            //console.log("Tiempo actual: " + currentTime.toString())
            //console.log("Tiempo transcurrido: " + (realLimitTime - currentTime).toString())
            
            if (currentTime > limitTime){
                // Cambiar estado del juego a "finished"
                console.log(`El tiempo límite ha expirado en ${variation}. Terminando el juego...`);
                game.status = "waiting";
                game.hAChoose = "no";
                game.acuHp = 0;
                game.acuPDef = 0;
                game.humanQtn = 0;

                // Eliminar jugadores del juego
                for (let i = 1; i <= 10; i++) {
                game[`player${i}`] = "none";
                }

                return;
            }

            if (currentTime > realLimitTime) {
                // Cambiar estado del juego a "finished"
                console.log(`Botando a los jugadores y despues de 5 segundos acabará la partida`);
                game.status = "finishing";

                return;
            }
            
            // Verificar si todos los jugadores son bots
            const allPlayersAreBots = Object.values(game).filter(val => typeof val === "object" && !val.username.startsWith("gamebot")).length === 0;

            // Verificar si no hay jugadores humanos
            const noHumanPlayers = Object.values(game).filter(val => typeof val === "object" && !val.username.startsWith("gamebot")).length === 0;


            if (allPlayersAreBots || noHumanPlayers) {
                // Cambiar estado del juego a "finished"
                console.log(`Todos los jugadores son bots o no hay jugadores humanos en ${variation}. Terminando el juego...`);
                game.status = "waiting";
                game.hAChoose = "no";
                game.acuHp = 0;
                game.acuPDef = 0;
                game.humanQtn = 0;
                
                // Eliminar jugadores del juego
                for (let i = 1; i <= 10; i++) {
                game[`player${i}`] = "none";
                }

                return;
            }

            //Acá actualizamos los bots de la partida para que se muevan aleatoriamente en el mapa cada 3 segundos
            //Aprovechamos el codigo para ver si hay un humano master, sino asignamos el master a otro jugador
            let hasHumanMaster = false; 

            for (let player in game){
                if (player == "status" || player == "limitTime" ||
                player == "healApplePos" || player == "hAChoose" ||
                player == "acuHp" || player == "humanQtn"||
                player == "acuPDef"){ continue; }
                
                if (game[player] !== "none"){
                    if (game[player].username.startsWith("gamebot")){

                        if (countBots > 2){
                            let posX = vrandom.int(300, 9700)
                            let posY = vrandom.int(300, 9700)
                            game[player].posx = posX
                            game[player].posy = posY
                        }

                        
                    } else {
                        if (game[player].master == "yes"){
                            hasHumanMaster = true
                        } 
                    }              
                    
                    if (game[player].hp < 1){
                        game[player] = "none"
                    }
                }
            }

            // Asignar rol de MASTER al primer jugador humano si no hay un jugador con ese rol
            if (!hasHumanMaster) {
                
                for (let player in game){
                    if (player == "status" || player == "limitTime" ||
                    player == "healApplePos" || player == "hAChoose" ||
                    player == "acuHp" || player == "humanQtn" ||
                    player == "acuPDef"){ continue; }
                    
                    if (game[player] !== "none"){
                        if (game[player].username.startsWith("gamebot")){
    
                            continue
                            
                        } else {
                            game[player].master = "yes"
                            break
                        }              
                    }
                }

            }


        } else if (game.status === "waiting") {  

            let hasHumanPlayer = false;
            for (let i = 1; i <= 10; i++) {
              if (game[`player${i}`] !== "none" && typeof game[`player${i}`] === "object" && !game[`player${i}`].username.startsWith("gamebot")) {
                hasHumanPlayer = true;
                break;
              }
            }

            let hasBots = false;
            for (let i = 1; i <= 10; i++) {
                if (game[`player${i}`] !== "none" && typeof game[`player${i}`] === "object" && game[`player${i}`].username.startsWith("gamebot")) {
                  hasBots = true;
                  break;
                }
              }
            
            if (!hasHumanPlayer) {
                if (hasBots){
                    // Eliminar bots del juego
                    for (let i = 1; i <= 10; i++) {
                        if (game[`player${i}`] !== "none" && game[`player${i}`].username.startsWith("gamebot")) {
                        game[`player${i}`] = "none";
                        }
                    }
                    game.status = "waiting";
                    console.log("Bots eliminados de: ")
                    console.log(variation)
                }
              
            } else {

                if (countBots < 3){
                    return
                }

                console.log("Se puede agregar bots en: ")
                console.log(variation)

              let botAdded = false;
          
              for (let i = 1; i <= 10; i++) {

                let posX = 0
                let posY = 0                

                if (game[`player${i}`] === "none") {
                    console.log("El mapa dondese agregfa el bot es: " + mapName)

                    // Mapa multijugador LOST EDEN
                    if (mapName == "lostEden"){
                        const mapSize = 10240
                        if (i === 1){
                            posX = mapSize - 150
                            posY = 150
                        } else if (i === 2){
                            posX = mapSize / 3 * 2
                            posY = 150
                        } else if (i === 3){
                            posX = mapSize / 3
                            posY = 150
                        } else if (i === 4){
                            posX = 150
                            posY = 150
                        } else if (i === 5){
                            posX = mapSize / 2 - 2000
                            posY = mapSize / 2
                        } else if (i === 6){
                            posX = mapSize / 2 + 2000
                            posY = mapSize / 2
                        } else if (i === 7){
                            posX = 150
                            posY = mapSize - 150
                        } else if (i === 8){
                            posX = mapSize / 3
                            posY = mapSize - 150
                        } else if (i === 9){
                            posX = mapSize / 3 * 2
                            posY = mapSize - 150
                        } else if (i === 10){
                            posX = mapSize - 150
                            posY = mapSize - 150
                        }

                        game[`player${i}`] = { username: `gamebot${i}`, type:"bot", master:"no", maxhp: 100, hp: 100, pDef: 1, posx: posX, posy: posY, status: "I" };
                        console.log(`Agregando bot en ${variation}`);
                        console.log(game);
                        botAdded = true;
                        break;
                    }                  
                  
                }
              }
          
              if (isGameFull(game)) {
                console.log(`Cambiando estado del juego a "playing" en ${variation}`);
                game.status = "playing";
                // Crear "limitTime" key con el timestamp para terminar el juego agrega 665 que son 11 minutos y 5 segundos
                const limitTime = Math.floor(Date.now() / 1000) + 665;
                game.limitTime = limitTime;

                let totalHp = game["acuHp"]
                let totalPDef = game["acuPDef"]
                let playerNumber = game["humanQtn"]
                let botHp = parseInt(totalHp/playerNumber)
                let botPDef = parseInt(totalPDef/playerNumber)
                console.log("Total P Defense: ", totalPDef)
                console.log("Human players: ", playerNumber)
                console.log("Bot P Def: ", botPDef) 

                // Add accumulative stats to bots
                for (let player in game){
                    if (player == "status" || player == "limitTime" ||
                    player == "healApplePos" || player == "hAChoose" ||
                    player == "acuHp" || player == "humanQtn" ||
                    player == "acuPDef"){ continue; }
                

                    if (game[player].type == "bot"){
                        
                        game[player].hp = botHp
                        game[player].pDef = botPDef
                        console.log("Se cambió la P Def del bot a:",game[player].pDef)
                    }
                    
                }  

                console.log(`El juego en ${variation} terminará en ${new Date(limitTime * 1000)}`);
              } else if (!botAdded) {
                console.log(`Esperando a que se agregue un bot en ${variation}`);
              }
            }    
            
            
          
        }
      }
    }
    if (countBots > 2){
        //console.log("reiniciando contador de bots")
        countBots = 0
    }
  }
  
  setInterval(addBotsToWaitingGames, 1000); //cada segundo, pero por el contador cada 3 segundos se agregará un bot
  