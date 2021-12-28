import styled from 'styled-components';
export type HomeProps = {};

export const StyledHome = styled.div`
	label {
		margin-bottom: 0;
	}

	.header-circle {
		position: absolute;
		width: 1235px;
		height: 1235px;
		left: 778px;
		top: -430px;
		border-radius: 50%;
		background: rgba(var(--secondary-color-rgb), 0.64);
	}

	.header-circle img {
		position: relative;
		top: 35%;
		left: 10%;
		width: 55%;
		height: 55%;
	}

	.header {
		padding-left: 80px;
		padding-top: 50px;
		background: var(--primary-color);
		color: white;
		font-size: 35px;
		height: 350px;
	}

	.header-alive {
		font-size: 3em;
		font-family: var(--title-font);
		font-style: normal;
		font-weight: 700;
		text-align: left;
		text-shadow: var(--drop-shadow);
		letter-spacing: 0.05em;
	}

	.header-desc {
		font-size: 2.2em;
		font-family: var(--title-font);
		font-style: normal;
		font-weight: 700;
		text-shadow: var(--drop-shadow);
		letter-spacing: 0.105em;
		margin-left: 10px;
	}

	.header-lore {
		position: relative;
		top: -30px;
		font-size: 0.8em;
		font-family: var(--title-font);
		text-shadow: var(--drop-shadow);
		font-style: normal;
		font-weight: normal;
		line-height: 35px;
	}

	#cursor {
		position: absolute;
	}

	#divider {
		position: absolute;
		width: 100%;
		left: 0;
		bottom: 0;
	}

	.card {
		text-align: left;
		border-radius: 25px;
		background-color: var(--background-color) !important;
		box-shadow: 0px 0px 15px 1px rgb(170, 170, 170);
		margin-bottom: 70px !important;
		-webkit-transition: all 0.2s ease;
		-moz-transition: all 0.2s ease;
		-o-transition: all 0.2s ease;
		transition: all 0.2s ease;
		cursor: pointer;
	}

	.card:nth-child(even):hover {
		transform: rotate(-2deg) scale(1.03) !important;
		box-shadow: 0px 0px 15px 1px var(--primary-color);
	}

	.card:nth-child(odd):hover {
		transform: rotate(2deg) scale(1.03) !important;
		box-shadow: 0px 15px 35px var(--primary-color);
	}

	.card p {
		font-size: 20px;
	}

	.card .card-img {
		max-height: 300px;
	}

	.curve {
		width: 100%;
	}

	@media screen and (max-width: 1200px) {
		.header-circle {
			width: 1100px;
			height: 1100px;
			left: 550px;
			top: -400px;
		}

		.header {
			font-size: 27px;
		}

		.header-lore {
			top: -15px;
		}
	}

	@media screen and (max-width: 1076px) {
		.header-circle {
			width: 1000px;
			height: 1000px;
			left: 500px;
			top: -350px;
		}

		.header {
			font-size: 25px;
		}

		.header-lore {
			top: -15px;
		}
	}

	@media screen and (max-width: 900px) {
		.header-circle {
			width: 800px;
			height: 800px;
			left: 450px;
			top: -200px;
		}

		.header {
			font-size: 23px;
		}

		.header-lore {
			top: -15px;
		}
	}

	@media screen and (max-width: 480px) {
		.header-circle {
			width: 1235px;
			height: 1235px;
			left: 778px;
			top: -430px;
		}
	}
`;