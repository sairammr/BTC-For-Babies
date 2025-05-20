// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TaskEscrow {
    uint256 public taskCounter;

    struct Task {
        uint256 id;
        address parent;
        address child;
        uint256 amount; // in native coin (satoshi for BTC)
        bool released;
    }

    mapping(uint256 => Task) public tasks;
    mapping(address => uint256[]) public parentToTaskIds;
    mapping(address => uint256[]) public childToTaskIds;

    event TaskCreated(uint256 indexed taskId, address indexed parent, address indexed child, uint256 amount);
    event TaskReleased(uint256 indexed taskId, address indexed parent, address indexed child, uint256 amount);

    /// @notice Parent assigns a task and escrows native coin by sending BTC along with call
    function createTask(address _child, uint256 _amount) external payable {
        require(_amount > 0, "Amount must be > 0");
        require(_child != address(0), "Invalid child address");

        taskCounter++;
        tasks[taskCounter] = Task({
            id: taskCounter,
            parent: msg.sender,
            child: _child,
            amount: _amount,
            released: false
        });

        parentToTaskIds[msg.sender].push(taskCounter);
        childToTaskIds[_child].push(taskCounter);

        emit TaskCreated(taskCounter, msg.sender, _child, msg.value);
    }

    /// @notice Parent releases escrowed funds to the child
    function release(uint256 _taskId) external {
        Task storage task = tasks[_taskId];
        require(task.id != 0, "Invalid task ID");
        require(msg.sender == task.parent, "Only parent can release funds");
        require(!task.released, "Task already released");
        require(address(this).balance >= task.amount, "Insufficient contract balance");

        task.released = true;

        (bool success, ) = task.child.call{value: task.amount}("");
        require(success, "BTC transfer failed");

        emit TaskReleased(_taskId, task.parent, task.child, task.amount);
    }

    /// @notice Returns all task IDs created by a parent
    function getTasksByParent(address _parent) external view returns (uint256[] memory) {
        return parentToTaskIds[_parent];
    }

    /// @notice Returns all task IDs assigned to a child
    function getTasksByChild(address _child) external view returns (uint256[] memory) {
        return childToTaskIds[_child];
    }

    /// @notice Get task details
    function getTaskDetails(uint256 _taskId) external view returns (
        uint256 id,
        address parent,
        address child,
        uint256 amount,
        bool released
    ) {
        Task storage task = tasks[_taskId];
        require(task.id != 0, "Invalid task ID");
        return (task.id, task.parent, task.child, task.amount, task.released);
    }

    /// @notice Check if contract has enough balance for releasing a task
    function hasEnoughBalance(uint256 _taskId) external view returns (bool) {
        Task storage task = tasks[_taskId];
        require(task.id != 0, "Invalid task ID");
        return address(this).balance >= task.amount;
    }

    /// @notice Allow contract to receive BTC
    receive() external payable {}
}