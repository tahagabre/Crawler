//Gesture Manager

'use strict';

export default function Gesture( game ) {
    this.game = game;

    this.taps = 0;

    this.swipeDispatched = false;
    this.holdDispatched = false;
    this.doubleTapDispatched = false;

    this.isTouching = false;
    this.isHolding = false;
    this.isDoubleTapping = false;

    this.onSwipe = new Phaser.Signal();
    this.onTap = new Phaser.Signal();
    this.onDoubleTap = new Phaser.Signal();
    this.onHold = new Phaser.Signal();

}

//Called each frame, constant listener
Gesture.prototype.update = function() {
    var distance = Phaser.Point.distance( this.game.input.activePointer.position, this.game.input.activePointer.positionDown );
    var duration = this.game.input.activePointer.duration;

    this.updateSwipe( distance, duration );
    this.updateTouch( distance, duration );
};

//Swipe Handler
Gesture.prototype.updateSwipe = function( distance, duration ) {
    if ( duration === -1 ) {
        this.swipeDispatched = false;
    } 

    //If we don't touch the screen for too long and change the position of the input during that touch
    else if ( !this.swipeDispatched && distance > /*150*/50 && duration > 100 && duration < Gesture.TIMES.SWIPE ) {
        var positionUp = this.game.input.activePointer.positionUp;
        this.onSwipe.dispatch( this, positionUp );

        this.swipeDispatched = true;
    }
};

//Handlers for Single Taps, Double Taps, and Holds
Gesture.prototype.updateTouch = function( distance, duration ) {
    var positionUp = this.game.input.activePointer.positionUp;

    if ( duration === -1 ) {
        //Single Tap Handler
        //Record each tap as it happens
        if ( this.isTouching ) {
            this.onTap.dispatch( this, positionUp );
            this.taps++;
        }

        //Double Tap Handler
        //For each tap that occurs, we check to see if the player has tapped at least once before in under 300 ms
        //If there are two taps and the time constraint is achieved, then dispatch the double tap event
        else if ( this.taps >= 2 && ( Gesture.TIMES.DOUBLETAP - this.game.input.activePointer.msSinceLastClick > 0 ) ) {
            this.taps = 0;
            this.isDoubleTapping = true;
            this.onDoubleTap.dispatch( this, positionUp );
        }

        this.isTouching = false;
        this.isHolding = false;
        this.holdDispatched = false;

    }

    //Hold Handler
    else if ( distance < 10 ) {
        if ( duration < Gesture.TIMES.HOLD ) {
            this.isTouching = true;
        } 
        
        else {
            this.isTouching = false;
            this.isHolding = true;

            if ( !this.holdDispatched ) {
                this.holdDispatched = true;

                this.onHold.dispatch( this, positionUp );
            }
        }
    } 

    else {
        this.isTouching = false;
        this.isHolding = false;
        this.isDoubleTapping = false;
    }
    return Gesture;
};

Gesture.SWIPE = 0;
Gesture.TAP = 1;
Gesture.HOLD = 2;
Gesture.DOUBLETAP = 3;

Gesture.TIMES = {
    HOLD: 250,
    SWIPE: 250,
    DOUBLETAP: 300
};