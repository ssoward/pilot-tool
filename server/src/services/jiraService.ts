import axios from 'axios';
import { config } from 'dotenv';

// Load environment variables
config();

// Constants
const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

// Configure Axios for Jira requests
const jiraApi = axios.create({
  baseURL: JIRA_BASE_URL,
  headers: {
    'Authorization': `Bearer ${JIRA_API_TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * Get a Jira issue by key
 */
export const getJiraIssue = async (issueKey: string) => {
  try {
    const response = await jiraApi.get(`/rest/api/3/issue/${issueKey}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Jira issue ${issueKey}:`, error);
    throw new Error(`Failed to fetch Jira issue: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Create a new Jira issue
 */
export const createJiraIssue = async (issueData: any) => {
  try {
    const response = await jiraApi.post('/rest/api/3/issue', issueData);
    return response.data;
  } catch (error) {
    console.error('Error creating Jira issue:', error);
    throw new Error(`Failed to create Jira issue: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Update an existing Jira issue
 */
export const updateJiraIssue = async (issueKey: string, issueData: any) => {
  try {
    const response = await jiraApi.put(`/rest/api/3/issue/${issueKey}`, issueData);
    return response.data;
  } catch (error) {
    console.error(`Error updating Jira issue ${issueKey}:`, error);
    throw new Error(`Failed to update Jira issue: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get all issues from a project
 */
export const getProjectIssues = async (projectKey: string) => {
  try {
    const jql = encodeURIComponent(`project=${projectKey} ORDER BY created DESC`);
    const response = await jiraApi.get(`/rest/api/3/search?jql=${jql}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching issues for project ${projectKey}:`, error);
    throw new Error(`Failed to fetch project issues: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Map Initiative to Jira issue format
 */
export const mapInitiativeToJiraIssue = (initiative: any) => {
  return {
    fields: {
      summary: initiative.name,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: initiative.description
              }
            ]
          }
        ]
      },
      project: {
        key: 'PILOT' // This should be configured per your Jira instance
      },
      issuetype: {
        name: 'Initiative' // This should match your Jira issue type
      },
      priority: {
        name: initiative.priority.charAt(0).toUpperCase() + initiative.priority.slice(1)
      },
      // Add custom fields as needed for your Jira instance
    }
  };
};

export default {
  getJiraIssue,
  createJiraIssue,
  updateJiraIssue,
  getProjectIssues,
  mapInitiativeToJiraIssue
};
