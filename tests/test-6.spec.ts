// types/api.ts
export interface LoginPayload {
  userDetails: {
    mobileNumber: string;
    password: string;
  };
}

export interface LoginResponse {
  status: number;
  message: string;
 
  errors: any;
}

export interface DashboardApiResponse {
  status: number;
  message: string;
  data: {
    daysConfig: number;
    activeLeads: Lead[];
    coldLeads: Lead[];
    closedWon: Lead[];
    closedLost: Lead[];
    projects: Project[];
    leadStatusCounts: LeadStatusCount[];
  };
  errors: any;
}

export interface Lead {
  id: string;
  name?: string;
  status: string;
  contactNumber?: string;
  email?: string;
}

export interface Project {
  projectId: string;
  projectName: string;
  status: number;
  totalLeads: number;
  leadsByStage: {
    "Pre Qualify": number;
    "Qualify": number;
    "Schedule Site Visit": number;
    "Site Visit": number;
    "Negotiation In Progress": number;
    "Payment In Progress": number;
    "Agreement": number;
    "Closed Won": number;
    "Closed Lost": number;
  };
}

export interface LeadStatusCount {
  label: string;
  value: number;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  mobile: string;
}

export interface BuilderData {
  id: string;
  name: string;
  agentId: string;
}

export interface DashboardCounts {
  activeLeads: number;
  coldLeads: number;
  closedWon: number;
  closedLost: number;
}

export interface TestResult {
  builder: string;
  builderId: string;
  agentId: string;
  timestamp: string;
  apiData: DashboardCounts;
  uiData?: DashboardCounts;
  projects: Project[];
  leadStatusCounts: LeadStatusCount[];
  isValid: boolean;
}

// services/authService.ts
import { APIRequestContext } from '@playwright/test';
import { LoginPayload, LoginResponse } from '../types/api';

export class AuthService {
  private authToken: string | null = null;
  private agentId: string | null = null;

  constructor(private request: APIRequestContext) {}

  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await this.request.post('https://api.realtor.works/global/auth', {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok()) {
      throw new Error(`Login failed: ${response.status()} ${response.statusText()}`);
    }

    const responseData: LoginResponse = await response.json();
    
    // Store auth token and agent ID for subsequent requests
    if (responseData.data.token) {
      this.authToken = responseData.data.token;
    }
    if (responseData.data.agentId) {
      this.agentId = responseData.data.agentId;
    }

    return responseData;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  getAgentId(): string | null {
    return this.agentId;
  }

  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }
}

// services/dashboardService.ts
import { APIRequestContext } from '@playwright/test';
import { DashboardApiResponse } from '../types/api';

export class DashboardService {
  constructor(
    private request: APIRequestContext,
    private authService: AuthService
  ) {}

  async getDashboardDetails(agentId: string, builderId: string): Promise<DashboardApiResponse> {
    const url = 'https://api.realtor.works/agent/getDashboardDetails';
    
    console.log(`Fetching dashboard data for Agent: ${agentId}, Builder: ${builderId}`);
    
    const response = await this.request.get(url, {
      params: {
        agentId,
        builderId
      },
      headers: this.authService.getAuthHeaders()
    });

    if (!response.ok()) {
      const errorText = await response.text();
      throw new Error(`Dashboard API failed: ${response.status()} ${response.statusText()}\nResponse: ${errorText}`);
    }

    const responseData: DashboardApiResponse = await response.json();
    
    if (responseData.status !== 200) {
      throw new Error(`API returned error status: ${responseData.status}\nMessage: ${responseData.message}`);
    }

    return responseData;
  }

  async getMultipleBuilderData(agentId: string, builderIds: string[]): Promise<DashboardApiResponse[]> {
    const results: DashboardApiResponse[] = [];
    
    for (const builderId of builderIds) {
      try {
        const data = await this.getDashboardDetails(agentId, builderId);
        results.push(data);
        
        // Add delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to get data for builder ${builderId}:`, error);
        // Continue with other builders even if one fails
      }
    }
    
    return results;
  }

  extractLeadCounts(apiResponse: DashboardApiResponse): DashboardCounts {
    return {
      activeLeads: apiResponse.data.activeLeads.length,
      coldLeads: apiResponse.data.coldLeads.length,
      closedWon: apiResponse.data.closedWon.length,
      closedLost: apiResponse.data.closedLost.length
    };
  }
}

// pages/BuilderSelectionPage.ts
import { Page, Locator } from '@playwright/test';

export class BuilderSelectionPage {
  readonly page: Page;
  readonly builderDropdown: Locator;
  readonly builderOptions: Locator;
  readonly selectedBuilderText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.builderDropdown = page.locator('select[name="builder"], .builder-select, [data-testid="builder-selector"]');
    this.builderOptions = page.locator('select[name="builder"] option, .builder-option');
    this.selectedBuilderText = page.locator('.selected-builder, .builder-name');
  }

  async selectBuilder(builderName: string): Promise<void> {
    console.log(`Selecting builder: ${builderName}`);
    
    try {
      // Try dropdown selection first
      if (await this.builderDropdown.isVisible({ timeout: 5000 })) {
        await this.builderDropdown.selectOption({ label: builderName });
        await this.page.waitForTimeout(2000); // Wait for data to load
      } else {
        // Alternative: click on builder option
        const builderOption = this.page.locator(`text="${builderName}"`).first();
        if (await builderOption.isVisible({ timeout: 5000 })) {
          await builderOption.click();
          await this.page.waitForTimeout(2000);
        } else {
          throw new Error(`Builder "${builderName}" not found in dropdown or options`);
        }
      }
    } catch (error) {
      console.error(`Failed to select builder "${builderName}":`, error);
      throw error;
    }
  }

  async selectBuilderById(builderId: string): Promise<void> {
    console.log(`Selecting builder by ID: ${builderId}`);
    
    try {
      if (await this.builderDropdown.isVisible({ timeout: 5000 })) {
        await this.builderDropdown.selectOption({ value: builderId });
        await this.page.waitForTimeout(2000);
      } else {
        const builderOption = this.page.locator(`[data-builder-id="${builderId}"]`).first();
        if (await builderOption.isVisible({ timeout: 5000 })) {
          await builderOption.click();
          await this.page.waitForTimeout(2000);
        } else {
          throw new Error(`Builder with ID "${builderId}" not found`);
        }
      }
    } catch (error) {
      console.error(`Failed to select builder by ID "${builderId}":`, error);
      throw error;
    }
  }

  async getSelectedBuilder(): Promise<string> {
    try {
      if (await this.selectedBuilderText.isVisible({ timeout: 5000 })) {
        return await this.selectedBuilderText.textContent() || '';
      }
      
      // Fallback: get selected option from dropdown
      if (await this.builderDropdown.isVisible()) {
        return await this.builderDropdown.inputValue();
      }
      
      return '';
    } catch (error) {
      console.error('Failed to get selected builder:', error);
      return '';
    }
  }

  async getAllAvailableBuilders(): Promise<string[]> {
    const builders: string[] = [];
    
    try {
      if (await this.builderOptions.isVisible({ timeout: 5000 })) {
        const options = await this.builderOptions.all();
        for (const option of options) {
          const text = await option.textContent();
          if (text && text.trim() !== '' && !text.includes('Select')) {
            builders.push(text.trim());
          }
        }
      }
    } catch (error) {
      console.error('Failed to get available builders:', error);
    }
    
    return builders;
  }
}

// pages/DashboardPage.ts (Enhanced)
import { Page, Locator } from '@playwright/test';
import { DashboardCounts } from '../types/api';

export class DashboardPage {
  readonly page: Page;
  readonly activeLeadsCard: Locator;
  readonly coldLeadsCard: Locator;
  readonly closedWonCard: Locator;
  readonly closedLostCard: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.activeLeadsCard = page.locator('[data-testid="active-leads"], .active-leads-card');
    this.coldLeadsCard = page.locator('[data-testid="cold-leads"], .cold-leads-card');
    this.closedWonCard = page.locator('[data-testid="closed-won"], .closed-won-card');
    this.closedLostCard = page.locator('[data-testid="closed-lost"], .closed-lost-card');
    this.loadingSpinner = page.locator('.loading, .spinner, [data-testid="loading"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/dashboard');
  }

  async waitForDashboardLoad(): Promise<void> {
    // Wait for loading to complete
    if (await this.loadingSpinner.isVisible({ timeout: 2000 })) {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    }
    
    // Wait for network to be idle
    await this.page.waitForLoadState('networkidle');
    
    // Wait for dashboard cards to be visible
    await this.page.waitForSelector('text=ACTIVE LEADS', { timeout: 10000 });
    
    // Additional wait for data to populate
    await this.page.waitForTimeout(3000);
  }

  async getLeadCounts(): Promise<DashboardCounts> {
    await this.waitForDashboardLoad();

    const activeLeads = await this.extractCountFromCard('ACTIVE LEADS');
    const coldLeads = await this.extractCountFromCard('COLD LEADS');
    const closedWon = await this.extractCountFromCard('CLOSED W