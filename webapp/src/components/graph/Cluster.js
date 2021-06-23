import React, {useState, useEffect} from 'react';

import Graph from "react-vis-network-graph";
import { useLocation } from 'react-router-dom'
import Slider from '@material-ui/core/Slider';
import LoadingOverlay from 'react-loading-overlay'
import ClipLoader from 'react-spinners/ClipLoader'

import './Graph.css'
import { IsEmpty } from '../../utils'


const Cluster = () => {

    let location = useLocation()

    const [data, setData] = useState({})
    const [graph, setGraph] = useState({})
    const [options, setOptions] = useState({})
    const [base1, setBase1] = useState("")
    const [base2, setBase2] = useState("")
    const [target1, setTarget1] = useState("")
    const [target2, setTarget2] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [noMatchFound, setNoMatchFound] = useState(false)

    useEffect(() => {
        let params = new URLSearchParams(location.search)
        setBase1(params.get('base1'))
        setBase2(params.get('base2'))
        setTarget1(params.get('target1'))
        setTarget2(params.get('target2'))

        fetch('/cluster?' + params).then(response => {
          if(response.ok){
            return response.json()
          }
        }).then(data => {
            if (!IsEmpty(data)) {
                setData(data)
                setGraph(data[0.8]["graph"])
                setOptions(data[0.8]["options"])
            }
            else {
                setNoMatchFound(true)
            }
            setIsLoading(false)
        })
      },[location])

    function valuetext(value) {
        return `${value}`;
    }
    
    function onThresholdChanged(event, value) {
        setGraph(data[value]["graph"])
        setOptions(data[value]["options"])
    }

    return (
    <div>
        {graph && options
        ? 
        <div className="graph-container">
            <div className="graph-top">
                <div className="graph-title">
                    <span className="entities-title base">
                        {base1}&nbsp;.*&nbsp;{base2}
                    </span>
                    &nbsp;&nbsp;&nbsp;&nbsp;~&nbsp;&nbsp;&nbsp;&nbsp;
                    <span className="entities-title target">
                        {target1}&nbsp;.*&nbsp;{target2}
                    </span>
                </div>
                <div className="slider">
                    <Slider
                        defaultValue={0.8}
                        getAriaValueText={valuetext}
                        aria-labelledby="discrete-slider-small-steps"
                        step={0.1}
                        min={0.1}
                        max={0.9}
                        valueLabelDisplay="on"
                        onChange={onThresholdChanged}
                    />
                    <span className="slider-title">
                        Distance Threshold (Clustering)
                    </span>
                </div>
            </div>
            {isLoading
            ?
            <div className="overlay-loading">
                <LoadingOverlay
                    active={isLoading}
                    spinner={<ClipLoader size={70} color="#469cac" />}
                />
            </div>
            :
            <Graph
                graph={graph}
                options={options}
            />
            }
            {
                noMatchFound
                ? <span style={{textAlign: 'center'}}>No Match found</span>
                : <></>
            }
        </div>
        :
        <></>
        }
    </div>
    );
}

export default Cluster;
