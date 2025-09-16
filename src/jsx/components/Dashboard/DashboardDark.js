import React,{useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { 
  FinancialChart, 
  RecentTransactions, 
  ExpenseBreakdown, 
  CircularProgress 
} from './Dashboard/AccountingComponents';


//Import Components
import { ThemeContext } from "../../../context/ThemeContext";
import ReservationStats from './Dashboard/ReservationStats';
import LatestReview from './Dashboard/LatestReview';
import RecentBooking from './Dashboard/RecentBooking';



const DashboardDark = () => {
	const { changeBackground } = useContext(ThemeContext);
	useEffect(() => {
		changeBackground({ value: "dark", label: "Dark" });
	}, []);
	
	return(
			<>
				{/* <div className="row">
					<div className="col-xl-12">
						<div className="row">
							<div className="col-xl-12">
								<div className="row">
									<div className="col-xl-3 col-sm-6">
										<div className="card booking">
											<div className="card-body">
												<div className="booking-status d-flex align-items-center">
													<span>
														<svg xmlns="http://www.w3.org/2000/svg" width="28" height="20" viewBox="0 0 28 20">
														  <path  d="M27,14V7a1,1,0,0,0-1-1H6A1,1,0,0,0,5,7v7a3,3,0,0,0-3,3v8a1,1,0,0,0,2,0V24H28v1a1,1,0,0,0,2,0V17A3,3,0,0,0,27,14ZM7,8H25v6H24V12a2,2,0,0,0-2-2H19a2,2,0,0,0-2,2v2H15V12a2,2,0,0,0-2-2H10a2,2,0,0,0-2,2v2H7Zm12,6V12h3v2Zm-9,0V12h3v2ZM4,17a1,1,0,0,1,1-1H27a1,1,0,0,1,1,1v5H4Z" transform="translate(-2 -6)" fill="var(--primary)"/>
														</svg>
													</span>
													<div className="ms-4">
														<h2 className="mb-0 font-w600">8,461</h2>
														<p className="mb-0 text-nowrap">New Booking</p>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="col-xl-3 col-sm-6">
										<div className="card booking">
											<div className="card-body">
												<div className="booking-status d-flex align-items-center">
													<span>
														<svg xmlns="http://www.w3.org/2000/svg" width="28" height="20" viewBox="0 0 28 20">
														  <path  d="M27,14V7a1,1,0,0,0-1-1H6A1,1,0,0,0,5,7v7a3,3,0,0,0-3,3v8a1,1,0,0,0,2,0V24H28v1a1,1,0,0,0,2,0V17A3,3,0,0,0,27,14ZM7,8H25v6H24V12a2,2,0,0,0-2-2H19a2,2,0,0,0-2,2v2H15V12a2,2,0,0,0-2-2H10a2,2,0,0,0-2,2v2H7Zm12,6V12h3v2Zm-9,0V12h3v2ZM4,17a1,1,0,0,1,1-1H27a1,1,0,0,1,1,1v5H4Z" transform="translate(-2 -6)" fill="var(--primary)"/>
														</svg>
													</span>
													<div className="ms-4">
														<h2 className="mb-0 font-w600">8,461</h2>
														<p className="mb-0 text-nowrap ">New Booking</p>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="col-xl-3 col-sm-6">
										<div className="card booking">
											<div className="card-body">
												<div className="booking-status d-flex align-items-center">
													<span>
														<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
														  <path  data-name="Path 1957" d="M129.035,178.842v2.8a5.6,5.6,0,0,0,5.6,5.6h14a5.6,5.6,0,0,0,5.6-5.6v-16.8a5.6,5.6,0,0,0-5.6-5.6h-14a5.6,5.6,0,0,0-5.6,5.6v2.8a1.4,1.4,0,0,0,2.8,0v-2.8a2.8,2.8,0,0,1,2.8-2.8h14a2.8,2.8,0,0,1,2.8,2.8v16.8a2.8,2.8,0,0,1-2.8,2.8h-14a2.8,2.8,0,0,1-2.8-2.8v-2.8a1.4,1.4,0,0,0-2.8,0Zm10.62-7-1.81-1.809a1.4,1.4,0,1,1,1.98-1.981l4.2,4.2a1.4,1.4,0,0,1,0,1.981l-4.2,4.2a1.4,1.4,0,1,1-1.98-1.981l1.81-1.81h-12.02a1.4,1.4,0,1,1,0-2.8Z" transform="translate(-126.235 -159.242)" fill="var(--primary)" fill-rule="evenodd"/>
														</svg>
													</span>
													<div className="ms-4">
														<h2 className="mb-0 font-w600">753</h2>
														<p className="mb-0">Check In</p>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="col-xl-3 col-sm-6">
										<div className="card booking">
											<div className="card-body">
												<div className="booking-status d-flex align-items-center">
													<span>
														<svg id="_009-log-out" data-name="009-log-out" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
														  <path  data-name="Path 1957" d="M151.435,178.842v2.8a5.6,5.6,0,0,1-5.6,5.6h-14a5.6,5.6,0,0,1-5.6-5.6v-16.8a5.6,5.6,0,0,1,5.6-5.6h14a5.6,5.6,0,0,1,5.6,5.6v2.8a1.4,1.4,0,0,1-2.8,0v-2.8a2.8,2.8,0,0,0-2.8-2.8h-14a2.8,2.8,0,0,0-2.8,2.8v16.8a2.8,2.8,0,0,0,2.8,2.8h14a2.8,2.8,0,0,0,2.8-2.8v-2.8a1.4,1.4,0,0,1,2.8,0Zm-10.62-7,1.81-1.809a1.4,1.4,0,1,0-1.98-1.981l-4.2,4.2a1.4,1.4,0,0,0,0,1.981l4.2,4.2a1.4,1.4,0,1,0,1.98-1.981l-1.81-1.81h12.02a1.4,1.4,0,1,0,0-2.8Z" transform="translate(-126.235 -159.242)" fill="var(--primary)" fill-rule="evenodd"/>
														</svg>
	
													</span>
													<div className="ms-4">
														<h2 className="mb-0 font-w600">516</h2>
														<p className="mb-0">Check Out</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xl-12">
								<div className="row">
									<div className="col-xl-6">
										<div className="card">
											<div className="card-header border-0 pb-0">
												<h4 className="fs-20">Recent Booking Schedule</h4>
											</div>
											<RecentBooking />
										</div>
									</div>
									<div className="col-xl-6">
										<div className="row">
											<div className="col-xl-12">
												<ReservationStats />
											</div>
											<div className="col-xl-6 col-sm-6">
												<div className="card bg-secondary">
													<div className="card-body">
														<div className="d-flex align-items-end pb-4 justify-content-between">
															<span className="fs-14 font-w500 text-white">Available Room Today</span>
															<span className="fs-20 font-w600 text-white"><span className="pe-2"></span>683</span>
														</div>
														<div className="progress default-progress h-auto">
															<div className="progress-bar bg-white progress-animated" style={{width: "60%", height:"13px" }}>
																<span className="sr-only">60% Complete</span>
															</div>
														</div>
														
													</div>
												</div>
											</div>
											<div className="col-xl-6 col-sm-6">
												<div className="card bg-secondary">
													<div className="card-body">
														<div className="d-flex align-items-end pb-4 justify-content-between">
															<span className="fs-14 font-w500 text-white">Sold Out Room Today</span>
															<span className="fs-20 font-w600 text-white"><span className="pe-2"></span>156</span>
														</div>
														<div className="progress default-progress h-auto">
															<div className="progress-bar bg-white progress-animated" style={{width: "30%", height:"13px"}} >
																<span className="sr-only">30% Complete</span>
															</div>
														</div>
														
													</div>
												</div>
											</div>
											<div className="col-xl-12">
												<div className="card">
													<div className="card-body">
														<div className="row">
															<div className="col-xl-3 col-sm-3 col-6 mb-4 col-xxl-6">
																<div className="text-center">
																	<h3 className="fs-28 font-w600">569</h3>
																	<span className="fs-16">Total Concierge</span>
																</div>
															</div>
															<div className="col-xl-3 col-sm-3 col-6 mb-4 col-xxl-6">
																<div className="text-center">
																	<h3 className="fs-28 font-w600">2,342</h3>
																	<span className="fs-16">Total Customer</span>
																</div>
															</div>
															<div className="col-xl-3 col-sm-3 col-6 mb-4 col-xxl-6">
																<div className="text-center">
																	<h3 className="fs-28 font-w600">992</h3>
																	<span className="fs-16">Total Room</span>
																</div>
															</div>
															<div className="col-xl-3 col-sm-3 col-6 mb-4 col-xxl-6">
																<div className="text-center">
																	<h3 className="fs-28 font-w600">76k</h3>
																	<span className="fs-16 wspace-no">Total Transaction</span>
																</div>
															</div>
															<div className="mb-5 mt-4 d-flex align-items-center">
																<div>
																	<h4><Link to={"#"} className="text-secondary">Let Travl Generate Your Annualy Report Easily</Link></h4>
																	<span className="fs-12">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labo
																	</span>
																</div>
																<div><Link to={"#"} className="ms-5"><i className="fas fa-arrow-right fs-20"></i></Link></div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>	
							</div>
							<div className="col-xl-12">
								<div className="card">
									<div className="card-header border-0 pb-0">
										<h4 className="fs-20">Latest Review by Customers</h4>
									</div>
									<div className="card-body pt-0">
										<LatestReview  />
									</div>	
								</div>	
							</div>
						</div>
					</div>
				</div>		 */}
				<div className="accounting-dashboard">
	  <div className="row">
		<div className="col-xl-12">
		  <div className="row">
			{/* Financial Summary Cards */}
			<div className="col-xl-12">
			  <div className="row">
				<div className="col-xl-3 col-md-6">
				  <div className="card financial-card revenue-card">
					<div className="card-body">
					  <div className="financial-status d-flex align-items-center">
						<span className="financial-icon">
						  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
							<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
						  </svg>
						</span>
						<div className="ms-4">
						  <h2 className="mb-0 font-w600">$124,568</h2>
						  <p className="mb-0">Total Revenue</p>
						  <span className="positive-trend">+12.5% <i className="fas fa-arrow-up"></i></span>
						</div>
					  </div>
					</div>
				  </div>
				</div>
				<div className="col-xl-3 col-md-6">
				  <div className="card financial-card expenses-card">
					<div className="card-body">
					  <div className="financial-status d-flex align-items-center">
						<span className="financial-icon">
						  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
							<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 14.5h-7v-2h7v2zm0-3.5h-7v-2h7v2zm0-3.5h-7V7h7v2z"/>
						  </svg>
						</span>
						<div className="ms-4">
						  <h2 className="mb-0 font-w600">$78,245</h2>
						  <p className="mb-0">Total Expenses</p>
						  <span className="negative-trend">-5.3% <i className="fas fa-arrow-down"></i></span>
						</div>
					  </div>
					</div>
				  </div>
				</div>
				<div className="col-xl-3 col-md-6">
				  <div className="card financial-card profit-card">
					<div className="card-body">
					  <div className="financial-status d-flex align-items-center">
						<span className="financial-icon">
						  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
							<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.5 14.5h-3v-5h3v5zm0-7h-3v-2h3v2z"/>
						  </svg>
						</span>
						<div className="ms-4">
						  <h2 className="mb-0 font-w600">$46,323</h2>
						  <p className="mb-0">Net Profit</p>
						  <span className="positive-trend">+8.2% <i className="fas fa-arrow-up"></i></span>
						</div>
					  </div>
					</div>
				  </div>
				</div>
				<div className="col-xl-3 col-md-6">
				  <div className="card financial-card invoices-card">
					<div className="card-body">
					  <div className="financial-status d-flex align-items-center">
						<span className="financial-icon">
						  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
							<path fill="currentColor" d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zm-9-1l-4-4l4-4l1.4 1.4L11.8 15H16v2h-4.2l1.6 1.6L13 19z"/>
						  </svg>
						</span>
						<div className="ms-4">
						  <h2 className="mb-0 font-w600">128</h2>
						  <p className="mb-0">Pending Invoices</p>
						  <span className="neutral-trend">2 new today</span>
						</div>
					  </div>
					</div>
				  </div>
				</div>
			  </div>
			</div>
			
			{/* Main Content Area */}
			<div className="col-xl-12">
			  <div className="row">
				{/* Financial Chart */}
				<div className="col-xl-8">
				  <div className="card">
					<div className="card-header border-0 pb-0">
					  <h4 className="fs-20">Financial Overview</h4>
					  <div className="dropdown">
						<button className="btn btn-link dropdown-toggle" type="button" data-bs-toggle="dropdown">
						  This Year
						</button>
						<ul className="dropdown-menu">
						  <li><a className="dropdown-item" href="#">This Year</a></li>
						  <li><a className="dropdown-item" href="#">Last Year</a></li>
						  <li><a className="dropdown-item" href="#">Last Quarter</a></li>
						</ul>
					  </div>
					</div>
					<div className="card-body">
					  <FinancialChart />
					</div>
				  </div>
				</div>
				
				{/* Quick Stats */}
				<div className="col-xl-4">
				  <div className="card">
					<div className="card-header border-0 pb-0">
					  <h4 className="fs-20">Quick Stats</h4>
					</div>
					<div className="card-body">
					  <div className="row">
						<div className="col-6 mb-4">
						  <div className="stat-card">
							<div className="stat-icon paid">
							  <i className="fas fa-check-circle"></i>
							</div>
							<h3>84</h3>
							<p>Paid Invoices</p>
						  </div>
						</div>
						<div className="col-6 mb-4">
						  <div className="stat-card">
							<div className="stat-icon overdue">
							  <i className="fas fa-exclamation-circle"></i>
							</div>
							<h3>23</h3>
							<p>Overdue</p>
						  </div>
						</div>
						<div className="col-6 mb-4">
						  <div className="stat-card">
							<div className="stat-icon clients">
							  <i className="fas fa-users"></i>
							</div>
							<h3>142</h3>
							<p>Active Clients</p>
						  </div>
						</div>
						<div className="col-6 mb-4">
						  <div className="stat-card">
							<div className="stat-icon recurring">
							  <i className="fas fa-sync-alt"></i>
							</div>
							<h3>15</h3>
							<p>Recurring</p>
						  </div>
						</div>
					  </div>
					</div>
				  </div>
				</div>
			  </div>
			</div>
			
			{/* Bottom Row */}
			<div className="col-xl-12">
			  <div className="row">
				{/* Recent Transactions */}
				<div className="col-xl-6">
				  <div className="card">
					<div className="card-header border-0 pb-0">
					  <h4 className="fs-20">Recent Transactions</h4>
					  <Link to="/transactions" className="btn btn-sm btn-link">View All</Link>
					</div>
					<div className="card-body">
					  <RecentTransactions />
					</div>
				  </div>
				</div>
				
				{/* Expense Breakdown */}
				<div className="col-xl-6">
				  <div className="card">
					<div className="card-header border-0 pb-0">
					  <h4 className="fs-20">Expense Breakdown</h4>
					  <div className="dropdown">
						<button className="btn btn-link dropdown-toggle" type="button" data-bs-toggle="dropdown">
						  By Category
						</button>
						<ul className="dropdown-menu">
						  <li><a className="dropdown-item" href="#">By Category</a></li>
						  <li><a className="dropdown-item" href="#">By Vendor</a></li>
						  <li><a className="dropdown-item" href="#">By Department</a></li>
						</ul>
					  </div>
					</div>
					<div className="card-body">
					  <ExpenseBreakdown />
					</div>
				  </div>
				</div>
			  </div>
			</div>
			
			{/* Financial Health */}
			<div className="col-xl-12">
			  <div className="card">
				<div className="card-header border-0 pb-0">
				  <h4 className="fs-20">Financial Health</h4>
				</div>
				<div className="card-body">
				  <div className="row">
					<div className="col-md-4">
					  <div className="health-card">
						<div className="health-progress">
						  <CircularProgress value={78} color="success" />
						</div>
						<h3>Cash Flow</h3>
						<p>Positive cash flow for 9 months</p>
					  </div>
					</div>
					<div className="col-md-4">
					  <div className="health-card">
						<div className="health-progress">
						  <CircularProgress value={65} color="warning" />
						</div>
						<h3>Savings Rate</h3>
						<p>15% of revenue saved monthly</p>
					  </div>
					</div>
					<div className="col-md-4">
					  <div className="health-card">
						<div className="health-progress">
						  <CircularProgress value={92} color="danger" />
						</div>
						<h3>Debt Ratio</h3>
						<p>Low debt-to-income ratio</p>
					  </div>
					</div>
				  </div>
				</div>
			  </div>
			</div>
		  </div>
		</div>
	  </div>
	</div>
			</>
		)
}
export default DashboardDark;