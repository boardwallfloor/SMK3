import React from 'react'
import Grid from '@material-ui/core/Grid';

import K3_1 from '../../asset/K3/K3_1.jpg';
import UGM2 from '../../asset/UGM/(PNG Image, 310 × 163 pixels).png'

const Footer = () => {
	return (
		<div>
			<Grid container spacing={0}>
				<Grid item xs>
					<img src={K3_1} alt='K3' width='310px' height="163px"/>
				</Grid>
				<Grid item xs>
					<img src={UGM2} alt='UGM' />
				</Grid>
				
			</Grid>
		</div>
	)
}

export default Footer;