import type { Branch } from '../../types';
export const branchNameCorrect = (branches: Branch[]) => {
  /* const branchLength = branches.length;
  if (branchLength < 2)
    throw new Error('if-else node branch number must than 2');

  if (branchLength === 2) {
    return branches.map((branch) => {
      return {
        ...branch,
        name: branch.id === 'false' ? 'ELSE' : 'IF',
      };
    });
  } */

  return branches.map((branch, index) => {
    return {
      ...branch,
      name: `INFO ${index + 1}`,
    };
  });
};
