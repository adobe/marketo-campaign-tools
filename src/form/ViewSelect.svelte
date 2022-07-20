<script>
    import { createEventDispatcher } from 'svelte';
    import { downloadFile } from '../lib/utils';
    import UtilityBar from './UtilityBar.svelte';
    import Select from './Select.svelte';

    const dispatch = createEventDispatcher();

    export let selectedPage = "table";
</script>
<UtilityBar urlPage={true}>
    <div class="utility-bar--content">
        <Select 
            label="View" 
            name="url-table-view" 
            on:input={(e) => dispatch("viewChanged", {view: e.target.value})} 
            options={[
                {
                    "label": "Table", 
                    "value": "table"
                },
                {
                    "label": "Detail", 
                    "value": "detail"
                }
            ]}
            value={selectedPage}
        />
        <button on:click={() => { downloadFile("entries") }}>Export URL List</button>
    </div>
</UtilityBar>

<style>
    .utility-bar--content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding: 0 2rem;
    }
</style>