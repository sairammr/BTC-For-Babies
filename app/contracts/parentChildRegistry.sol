// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ParentChildRegistry {

    struct Child {
        address childAddress;
        string secret; // This is visible to anyone inspecting the blockchain!
    }

    // Mapping from parent to their children
    mapping(address => Child[]) private parentToChildren;

    // Only allows the parent to access their children
    modifier onlyParent(address _parent) {
        require(msg.sender == _parent, "Only the parent can access this data.");
        _;
    }

    /// @notice Add a child under the calling parent's registry
    /// @param _childAddress The child's wallet address
    /// @param _secret The secret string (e.g., private key or other sensitive info)
    function addChild(address _childAddress, string calldata _secret) external {
        Child memory newChild = Child({
            childAddress: _childAddress,
            secret: _secret
        });

        parentToChildren[msg.sender].push(newChild);
    }

    /// @notice View all children under a parent
    /// @param _parent The parent address
    /// @return Array of children (including secret)
    function getChildren(address _parent)
        external
        view
        onlyParent(_parent)
        returns (Child[] memory)
    {
        return parentToChildren[_parent];
    }

    /// @notice Get the number of children a parent has
    /// @param _parent The parent address
    function getChildCount(address _parent)
        external
        view
        onlyParent(_parent)
        returns (uint256)
    {
        return parentToChildren[_parent].length;
    }
}
