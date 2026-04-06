import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import React, { useState } from 'react'
import { Button } from 'primereact/button';
import { ButtonGroup } from 'primereact/buttongroup';
const NodeTemplate = (props:any) => {
  const { node ,options ,setNodes} = props;
  const [policies, setPolicies] = useState<string[]>([]);
  function updateNodeInTree(nodes: any[], key: string, updatedNode: any): any[] {
    return nodes.map(node => {
      if (node.key === key) {
        return updatedNode;
      }
      
      if (node.children) {
        return {
          ...node,
          children: updateNodeInTree(node.children, key, updatedNode)
        };
      }
      
      return node;
    });
  }
  function addPolicyToAllDescendants(nodes: any[], parentKey: string, policy: string): any[] {
    return nodes.map(node => {
      // If this is the target parent node
      if (node.key === parentKey) {
        // Clone the node to avoid direct mutation
        const updatedNode = { ...node };
        
        // If the node has children, update them and all their descendants
        if (updatedNode.children) {
          updatedNode.children = updatedNode.children.map((child: any) => 
            addPolicyToNodeAndDescendants(child, policy)
          );
        }
        
        return updatedNode;
      }
      
      // If this isn't the parent node but has children, recurse through them
      if (node.children) {
        return {
          ...node,
          children: addPolicyToAllDescendants(node.children, parentKey, policy)
        };
      }
      
      return node;
    });
  }
  
  // Helper function to add policy to a node and all its descendants
  function addPolicyToNodeAndDescendants(node: any, policy: string): any {
    // Add policy to current node
    const _policies = node.policies || []
    const updatedNode = {
      ...node,
      policies: node?.policies?.includes(policy) ? node?.policies : [..._policies, policy]
    };
    
    // If node has children, update them too
    if (node.children) {
      updatedNode.children = node.children.map((child: any) => 
        addPolicyToNodeAndDescendants(child, policy)
      );
    }
    
    return updatedNode;
  }
  const applyToChildren = (policy: string) => {
    setNodes((prevNodes: any[]) => 
      addPolicyToAllDescendants(prevNodes, node.key, policy)
    );
  };
    const onIngredientsChange = (e:any) => {
        let _policies = node?.policies ?[...node?.policies]: [];

        if (e.checked)
            _policies.push(e.value);
        else
            _policies.splice(_policies.indexOf(e.value), 1);

        setPolicies(_policies);
        setNodes((prevNodes: any[]) => 
          updateNodeInTree(prevNodes, node.key, { ...node, policies:_policies })
        );
    }
      const addPolicy = (policy:string) => {
        let _policies = node?.policies ?[...node?.policies]: [];

        if (node?.policies?.includes(policy))
           _policies=node?.policies
        else
        _policies=[..._policies, policy]

        setPolicies(_policies);
        console.log('node To Apply',node);
        setNodes((prevNodes: any[]) => 
          updateNodeInTree(prevNodes, node.key, { ...node, policies:_policies })
        );
    }
    if(node.label==="WORKFLOW"){
    }
  return (
    <Card className="flex flex-column surface-100 p-0 border-round-lg " style={{ width: '50vw', minWidth: '300px', border: '1px solid #e5e7eb' }}>
    <style>{`
      .p-button-group {
        width: 100%;
        gap: 0.5rem;
      }
        .p-card-body {
        padding:0px
      }
         .p-card-content {
        padding-top:0px
      }
      .policy-button {
        transition: all 0.2s;
        border-color: #d1d5db !important;
      }
      .policy-button:hover {
        background-color: #f9fafb !important;
        border-color: #9ca3af !important;
      }
      .checkbox-label:hover {
        color: #111827;
      }
    `}</style>
    
    <div className="p-4 font-bold text-xl mb-3 text-gray-900 surface-300">
      {node?.label}
    </div>
    {node.link &&
     <div className="card flex flex-wrap justify-content-start gap-4 font-normal text-base p-4">
     <div className="flex align-items-center">
       <Checkbox 
         inputId="ingredient1" 
         name="pizza" 
         value="create" 
         onChange={onIngredientsChange} 
         checked={node?.policies?.includes('create')}
         className="mr-2 border-gray-300"
       />
       <label htmlFor="" className="text-gray-700 hover:text-gray-900 cursor-pointer">Create</label>
     </div>
     <div className="flex align-items-center">
       <Checkbox 
         inputId="ingredient2" 
         name="pizza" 
         value="update" 
         onChange={onIngredientsChange} 
         checked={node?.policies?.includes('update')}
         className="mr-2 border-gray-300"
       />
       <label htmlFor="" className="text-gray-700 hover:text-gray-900 cursor-pointer">Update</label>
     </div>
     <div className="flex align-items-center">
       <Checkbox 
         inputId="ingredient3" 
         name="pizza" 
         value="read" 
         onChange={onIngredientsChange} 
         checked={node?.policies?.includes('read')}
         className="mr-2 border-gray-300"
       />
       <label htmlFor="" className="text-gray-700 hover:text-gray-900 cursor-pointer">Read</label>
     </div>
     <div className="flex align-items-center">
       <Checkbox 
         inputId="ingredient4" 
         name="pizza" 
         value="delete" 
         onChange={onIngredientsChange} 
         checked={node?.policies?.includes('delete')}
         className="mr-2 border-gray-300"
       />
       <label htmlFor="" className="text-gray-700 hover:text-gray-900 cursor-pointer">Delete</label>
     </div>
   </div>
    }
   
    {node.children && (
      <div className="card flex flex-column w-full gap-2 p-4">
        <ButtonGroup>
          <Button 
            label="Create all" 
            className='policy-button w-full p-button-outlined text-gray-700' 
            size='small'
            type='button'
            onClick={() =>{
              addPolicy('create')
              applyToChildren('create')}} 

          />
          <Button 
            label="Read all" 
            className='policy-button w-full p-button-outlined text-gray-700' 
            size='small'
            type='button'
            onClick={() => {
              addPolicy('read')
              
              applyToChildren('read')}} 
          />
          <Button 
            label="Update all" 
            className='policy-button w-full p-button-outlined text-gray-700' 
            size='small'
            type='button'
            onClick={() =>{
              addPolicy('update')
              applyToChildren('update')}} 
          />
          <Button 
            label="Delete all" 
            className='policy-button w-full p-button-outlined text-gray-700' 
            size='small'
            type='button'
            onClick={() => {
              addPolicy('delete')
              
              applyToChildren('delete')}}
          />
        </ButtonGroup>
      </div>
    )}
  </Card>
  )
}

export default NodeTemplate