import { ApiService } from '../environment/api-service';
import type { 
  Agent, 
  AgentCreateParams, 
  AgentUpdateParams, 
  AgentRunResult, 
  AgentLog 
} from '@/types/agent';

// 代理服务类
class AgentsApiService extends ApiService {
  private endpoint = '/api/agents';

  // 获取所有代理
  public async getAllAgents(): Promise<Agent[]> {
    return this.get<{ agents: Agent[] }>(this.endpoint)
      .then(response => response.agents);
  }

  // 获取单个代理
  public async getAgent(id: string): Promise<Agent> {
    return this.get<{ agent: Agent }>(`${this.endpoint}/${id}`)
      .then(response => response.agent);
  }

  // 创建代理
  public async createAgent(agent: AgentCreateParams): Promise<Agent> {
    return this.post<{ agent: Agent }, AgentCreateParams>(this.endpoint, agent)
      .then(response => response.agent);
  }

  // 更新代理
  public async updateAgent(id: string, updates: AgentUpdateParams): Promise<Agent> {
    return this.put<{ agent: Agent }, AgentUpdateParams>(`${this.endpoint}/${id}`, updates)
      .then(response => response.agent);
  }

  // 删除代理
  public async deleteAgent(id: string): Promise<{ success: boolean }> {
    return this.delete<{ success: boolean }>(`${this.endpoint}/${id}`);
  }

  // 运行代理
  public async runAgent(id: string): Promise<AgentRunResult> {
    return this.post<{ result: AgentRunResult }>(`${this.endpoint}/${id}/run`)
      .then(response => response.result);
  }

  // 停止代理
  public async stopAgent(id: string): Promise<{ success: boolean }> {
    return this.post<{ success: boolean }>(`${this.endpoint}/${id}/stop`);
  }

  // 获取代理运行结果
  public async getAgentResults(id: string): Promise<AgentRunResult[]> {
    return this.get<{ results: AgentRunResult[] }>(`${this.endpoint}/${id}/results`)
      .then(response => response.results);
  }

  // 获取代理日志
  public async getAgentLogs(id: string, limit: number = 100): Promise<AgentLog[]> {
    return this.get<{ logs: AgentLog[] }>(`${this.endpoint}/${id}/logs`, {
      limit: limit.toString()
    }).then(response => response.logs);
  }

  // 清除代理日志
  public async clearAgentLogs(id: string): Promise<{ success: boolean }> {
    return this.delete<{ success: boolean }>(`${this.endpoint}/${id}/logs`);
  }

  // 复制代理
  public async duplicateAgent(id: string): Promise<Agent> {
    return this.post<{ agent: Agent }>(`${this.endpoint}/${id}/duplicate`)
      .then(response => response.agent);
  }
}

// 导出单例实例
export const agentsApi = new AgentsApiService();