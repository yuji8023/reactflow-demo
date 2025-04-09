export type WorkflowFinishedResponse = {
  task_id: string;
  workflow_run_id: string;
  event: string;
  data: {
    id: string;
    workflow_id: string;
    status: string;
    outputs: any;
    error: string;
    elapsed_time: number;
    total_tokens: number;
    total_steps: number;
    created_at: number;
    created_by: {
      id: string;
      name: string;
      email: string;
    };
    finished_at: number;
    files?: any[];
  };
};

export type WorkflowStartedResponse = {
  task_id: string;
  workflow_run_id: string;
  event: string;
  data: {
    id: string;
    workflow_id: string;
    sequence_number: number;
    created_at: number;
  };
};
