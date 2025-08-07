local playerStates = {
    hunger = nil,
    thirst = nil,
    cinemaMode = false
}


lib.onCache('vehicle', function(vehicle)
    CreateThread(function()
        while cache.vehicle do
            DisplayRadar(true)
            SendNUIMessage({
                action = "showCarHud",
                speed = math.floor(GetEntitySpeed(cache.vehicle) * 3.6),
                street = GetStreet(),
                bodyHealth = math.floor(GetVehicleBodyHealth(vehicle) / 10),
                engineHealth = math.floor(GetVehicleEngineHealth(vehicle) / 10),
                fuel = GetVehicleFuelLevel(vehicle)
            })
            Wait(100)
        end
        SendNUIMessage({
            action = "closeCarHud"
        })
        DisplayRadar(false)
    end)
end)

Citizen.CreateThread(function()
    while not ESX.IsPlayerLoaded() do
        Wait(250)
    end
    while true do
        local playerId = GetPlayerServerId(PlayerId())
        TriggerEvent("esx_status:getStatus", 'hunger', function(hungerStatus)
            TriggerEvent("esx_status:getStatus", 'thirst', function(thirstStatus)
                local hunger = math.floor(hungerStatus.val / 10000)
                local thirst = math.floor(thirstStatus.val / 10000)
                DisplayHud(false)
                SendNUIMessage({
                    action = "showHud",
                    playerId = playerId,
                    health = math.max(0, math.floor((GetEntityHealth(cache.ped) - 100) / 100 * 100)),
                    hunger = hunger,
                    thirst = thirst,
                    talking = MumbleIsPlayerTalking(PlayerId()),
                    talkingProximity = NetworkGetTalkerProximity(),
                    pauseMenu = IsPauseMenuActive()
                })
            end)
        end)
        Wait(300)
    end
end)

RegisterCommand("hud", function()
    SendNUIMessage({
        action = "showSettings"
    })
    SetNuiFocus(true, true)
end)

RegisterNUICallback("close", function(_, cb)
    SetNuiFocus(false, false)
    cb(true)
end)

RegisterNUICallback("cinemaMode", function(data, cb)
    playerStates.cinemaMode = data.on
    cb("ok")
end)

function GetStreet()
    local coords = GetEntityCoords(PlayerPedId())
    local street = GetStreetNameFromHashKey(GetStreetNameAtCoord(coords.x, coords.y, coords.z))
    return street
end
