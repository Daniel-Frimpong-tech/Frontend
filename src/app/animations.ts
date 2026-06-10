import {query,group, trigger, transition, style, animate } from "@angular/animations";

export const slideInAnimation = trigger('routeAnimations', [
    transition('* <=> *', [
        style({position: 'relative'}),
        query(':enter, :leave', [
            style({
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
            }),
        ],{optional:true}),
        group([
            query(':leave',[
                animate('1s ease-in-out', style({left:'100%'}))
            ],{optional:true}),
            query(':enter',[
                style({left:'-100%'}),
                animate('1s ease-in-out', style({left:'0%'}))
            ],{optional:true}),
        ])
        
    ]),

]);