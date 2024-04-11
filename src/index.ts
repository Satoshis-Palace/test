export * from "./modules/shared"
import * as snip20 from './modules/snip20';
import * as snip721 from './modules/snip721';
import * as governance from "./modules/governance";
import * as slots from "./modules/slots";
import * as blackjack from "./modules/blackjack";
import * as lottery from "./modules/lottery";
import * as exchange from "./modules/exchange";
import * as contest from "./modules/contests";
import * as deployment from "./deployment"
import * as master_viewing_key from "./modules/master-viewing-key"
import "./polyfills"

import { Snip20Deployment, Snip721Deployment, GovernanceDeployment, SlotsDeployment, BlackjackDeployment, LotteryDeployment, ExchangeDeployment, ContestsDeployment, MasterViewingKeyDeployment } from "./deployment"
// Re-export these namespaces
export {
	snip20,
	snip721,
	governance,
	blackjack,
	lottery,
	slots,
	exchange,
	contest,
	deployment,
	master_viewing_key,

	MasterViewingKeyDeployment,
	Snip20Deployment,
	Snip721Deployment,
	GovernanceDeployment,
	SlotsDeployment,
	BlackjackDeployment,
	LotteryDeployment,
	ExchangeDeployment,
	ContestsDeployment,
};
