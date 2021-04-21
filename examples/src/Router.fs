﻿[<RequireQualifiedAccess>]
module Router

open Elmish.UrlParser
open Elmish.Navigation
open Feliz
open Browser.Dom

[<RequireQualifiedAccess>]
type Route =
    | Home
    | SignUp
    | Login
    | DynamicForm
    | FormList
    | NotFound


let private toHash page =
    let segmentsPart =
        match page with
        | Route.Home -> "home"
        | Route.SignUp -> "sign-up"
        | Route.Login -> "login"
        | Route.NotFound -> "not-found"
        | Route.DynamicForm -> "dynamic-form"
        | Route.FormList -> "form-list"

    "#" + segmentsPart

let routeParser: Parser<Route->Route,Route> =
    oneOf
        [
            map Route.Home (s "home")
            map Route.SignUp (s "sign-up")
            map Route.Login (s "login")
            map Route.DynamicForm (s "dynamic-form")
            map Route.FormList (s "form-list")
            map Route.Home top
        ]

let href route =
    prop.href (toHash route)

let modifyUrl route =
    route
    |> toHash
    |> Navigation.modifyUrl

let newUrl route =
    route
    |> toHash
    |> Navigation.newUrl

let modifyLocation route =
    window.location.href <- toHash route
