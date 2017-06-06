<template>
	<div class="loading-container flex">
		<div class="loading">
			<div class="circle circle-child"></div>
			<div class="circle2 circle-child"></div>
			<div class="circle3 circle-child"></div>
			<div class="circle4 circle-child"></div>
			<div class="circle5 circle-child"></div>
			<div class="circle6 circle-child"></div>
			<div class="circle7 circle-child"></div>
			<div class="circle8 circle-child"></div>
			<div class="circle9 circle-child"></div>
			<div class="circle10 circle-child"></div>
			<div class="circle11 circle-child"></div>
			<div class="circle12 circle-child"></div>
		</div>
	</div>
</template>

<style>
	.loading {position: relative;margin:auto;width: 1rem;height: 1rem;}
	.circle-child {height: 100%;width: 100%;position: absolute;left: 0;top: 0;}
	.circle-child:before{content:'';width: 15%;height: 15%;background-color: #d43c33;display: block;border-radius: 100%;margin:0 auto;animation: sk-circleBounceDelay 1.2s infinite ease-in-out both;}
	.circle2 {transform: rotate(30deg);} .circle2:before {animation-delay: -1.1s;}
	.circle3 {transform: rotate(60deg);} .circle3:before {animation-delay: -1.0s;}
	.circle4 {transform: rotate(90deg);} .circle4:before {animation-delay: -0.9s;}
	.circle5 {transform: rotate(120deg);} .circle5:before {animation-delay: -0.8s;}
	.circle6 {transform: rotate(150deg);} .circle6:before {animation-delay: -0.7s;}
	.circle7 {transform: rotate(180deg);} .circle7:before {animation-delay: -0.6s;}
	.circle8 {transform: rotate(210deg);} .circle8:before {animation-delay: -0.5s;}
	.circle9 {transform: rotate(240deg);} .circle9:before {animation-delay: -0.4s;}
	.circle10 {transform: rotate(270deg);} .circle10:before {animation-delay: -0.3s;}
	.circle11 {transform: rotate(300deg);} .circle11:before {animation-delay: -0.2s;}
	.circle12 {transform: rotate(330deg);} .circle12:before {animation-delay: -0.1s;}

	@keyframes sk-circleBounceDelay {
		from {
			transform :scale(1);
		}
		50% {
			transform :scale(0);
		}
		to {
			transform :scale(1);
		}

	}
</style>